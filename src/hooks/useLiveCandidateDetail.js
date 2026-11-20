import { useCallback, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { fetchMatches, fetchNotice, fetchPet, imageUrl, saveFeedback, toCandidate } from '../apis/pets'
import { formatPetAge } from '../utils/formatPetInfo'
import { candidatesPath } from '../routes/petPaths'
import usePetRequest from './usePetRequest'

export default function useLiveCandidateDetail() {
  const { candidateId } = useParams()
  const [params] = useSearchParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const petId = params.get('pet')
  const [action, setAction] = useState(null)

  const load = useCallback(async () => {
    const [pet, matches] = await Promise.all([fetchPet(petId), fetchMatches(petId, 'similarity')])
    let row = matches.items.find(item => String(item.matchId) === candidateId)
    if (!row && !state?.candidate) {
      const byDeadline = await fetchMatches(petId, 'deadline')
      row = byDeadline.items.find(item => String(item.matchId) === candidateId)
    }
    const selected = row ? toCandidate(row) : state?.candidate?.id === candidateId && state.petId === petId ? state.candidate : null
    if (!selected) return { pet }
    if (selected.type === 'sighting') return { pet, candidate: selected }
    const notice = await fetchNotice(selected.noticeId)
    return { pet, candidate: {
      ...selected, photo: imageUrl(notice.imageUrl) || selected.photo, species: notice.species, breed: notice.breed,
      sex: notice.sex, coat: notice.color, age: formatPetAge(notice.age), weight: notice.weight, announcementId: notice.noticeNo,
      reportedAt: notice.happenDate, description: [notice.specialMark, notice.happenPlace].filter(Boolean).join(' · '),
      deadlineDays: notice.noticeEndDate ? notice.deadline?.daysLeft : null, deadlineDate: notice.noticeEndDate,
      urgent: notice.deadline?.urgent, closed: notice.deadline?.closed, closedMessage: notice.deadline?.closedMessage,
      facility: notice.shelter?.name, phone: notice.shelter?.tel, address: notice.shelter?.address,
      mapUrl: notice.shelter?.mapUrl,
    } }
  }, [candidateId, petId, state])

  const query = usePetRequest(load, Boolean(petId && candidateId))
  const { pet, candidate } = query.data ?? {}
  const backTo = candidatesPath(petId)
  const feedbackEnabled = Boolean(pet && pet.status !== 'found' && !action?.busy)

  async function handleFeedback(value) {
    if (!feedbackEnabled || !candidate) return
    setAction({ busy: true })
    try {
      await saveFeedback(candidate.id, value)
      navigate(backTo, { replace: true, state: value === 'hidden' ? { hiddenCandidateId: candidate.id } : undefined })
    } catch (error) {
      setAction({ error: error.message })
    }
  }

  return {
    pet, candidate, backTo, isSighting: candidate?.type === 'sighting', closed: candidate?.closed,
    phone: candidate?.phone, mapUrl: candidate?.mapUrl, shelter: candidate, feedbackEnabled, handleFeedback,
    loading: query.loading, error: query.error, retry: query.reload, actionError: action?.error,
  }
}
