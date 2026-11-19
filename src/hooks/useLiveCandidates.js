import { useCallback, useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { fetchMatches, fetchPet, fetchPets, retryMatches, saveFeedback, toCandidate, updatePet } from '../apis/pets'
import { formatPetDate } from '../utils/formatPetInfo'
import useAuth from './useAuth'
import useCandidateListPet from './useCandidateListPet'
import usePetRequest from './usePetRequest'

const phases = {
  NOT_REQUESTED: 'pending', PENDING: 'analyzing', PROCESSING: 'analyzing',
  READY: 'ready', FAILED: 'analysis-error', PARTIAL: 'partial', CANCELLED: 'found',
}

export default function useLiveCandidates() {
  const [params] = useSearchParams()
  const { state } = useLocation()
  const { user } = useAuth()
  const requestedId = params.get('pet')
  const pets = usePetRequest(fetchPets, !requestedId)
  const loadPet = useCallback(() => fetchPet(requestedId), [requestedId])
  const selected = usePetRequest(loadPet, Boolean(requestedId))
  const accountId = user?.userId ?? user?.id ?? user?.email
  const pet = useCandidateListPet(pets.data, selected.data, accountId == null ? null : `account:${accountId}`)
  const petId = pet?.id
  const [sort, setSort] = useState('score')
  const [undo, setUndo] = useState(null)
  const [mutation, setMutation] = useState(null)
  const load = useCallback(() => fetchMatches(petId, sort === 'score' ? 'similarity' : 'deadline'), [petId, sort])
  const matches = usePetRequest(load, Boolean(petId))
  const response = matches.data
  const { reload } = matches
  const retryAfter = response?.retryAfterSeconds
  const autoRefresh = ['PENDING', 'PROCESSING'].includes(response?.processingStatus)

  useEffect(() => {
    if (!autoRefresh) return
    const timer = window.setTimeout(reload, (retryAfter ?? 10) * 1000)
    return () => window.clearTimeout(timer)
  }, [autoRefresh, retryAfter, reload])

  const error = selected.error || pets.error || matches.error
  const phase = error ? 'error'
    : (selected.loading || pets.loading || matches.loading) && !response ? 'loading'
      : phases[response?.processingStatus] ?? 'pending'
  const found = phase === 'found'
  const visibleCandidates = (response?.items ?? []).map(toCandidate)
  const pinnedCandidates = visibleCandidates.filter(item => item.feedback === 'YES')
  const shownCandidates = found ? visibleCandidates : visibleCandidates.filter(item => item.feedback !== 'YES')
  const viewingList = ['ready', 'partial', 'found'].includes(phase)
  const latestHiddenId = undo && undo.petId === petId ? undo.id
    : undo === null && petId ? state?.hiddenCandidateId : null
  const lostDate = formatPetDate(pet?.lostDate, true)
  const statusText = [pet?.district || pet?.city, lostDate && `${lostDate} 실종`, pet && (found || pet.status === 'found' ? '찾음' : '찾는 중')].filter(Boolean).join(' · ')
  const action = mutation?.petId === petId ? mutation : null

  async function run(work, onSuccess) {
    if (action?.busy) return
    setMutation({ petId, busy: true })
    try {
      await work()
      onSuccess?.()
      reload()
      setMutation({ petId, busy: false })
    } catch (error) {
      setMutation({ petId, error: error.message })
    }
  }

  return {
    pet, sort, setSort, phase, found, viewingList, visibleCandidates, pinnedCandidates, shownCandidates,
    latestHiddenId, hiddenCount: latestHiddenId ? 1 : 0, precise: true, statusText,
    resultLabel: viewingList ? `후보 ${response.totalCount}건` : phase === 'loading' ? '불러오는 중' : '',
    processingMessage: response?.processingMessage, actionError: action?.error, busy: action?.busy,
    retryLoading: () => { if (error === selected.error) selected.reload(); else if (error === pets.error) pets.reload(); else reload() },
    retryAnalysis: () => run(() => retryMatches(petId)),
    showFeedback: (id, choice) => run(
      () => choice === 'found' ? updatePet(petId, { status: 'FOUND' }) : saveFeedback(id, choice),
      () => setUndo({ petId, id: choice === 'hidden' ? id : null }),
    ),
  }
}
