import { useEffect, useRef, useState } from 'react'
import useMockScenario from '../mocks/useMockScenario'
import usePawPose, { selectCandidatePet } from '../mocks/usePawPose'
import { formatPetDate } from '../utils/formatPetInfo'

export const PREVIEW_OPTIONS = {
  loading: '13 로딩',
  analyzing: '14 분석 중',
  'analysis-error': '15 분석 실패',
  partial: '16 일부 실패',
  pending: '17 정보 대기',
  feedback: '18 피드백 반영',
  error: '19 조회 오류',
}
export function candidateDeadline(candidate) {
  return !candidate.closed && Number.isFinite(candidate.deadlineDays) && candidate.deadlineDays >= 0
    ? candidate.deadlineDays
    : Number.POSITIVE_INFINITY
}

function compareCandidates(left, right, sort) {
  if (sort === 'deadline') {
    const leftDeadline = candidateDeadline(left)
    const rightDeadline = candidateDeadline(right)
    if (leftDeadline !== rightDeadline) return leftDeadline - rightDeadline
  }

  return right.score - left.score
}

function initialPreviewFeedback(candidates, scenario) {
  if (scenario !== 'feedback') return {}
  const [first, second] = [...candidates].sort((left, right) => right.score - left.score)
  return first && second ? { [first.id]: 'match', [second.id]: 'hidden' } : {}
}

export default function useCandidatesPage() {
  const { params, scenario: requestedScenario } = useMockScenario()
  const restorePreviewFocus = useRef(false)
  const { pets, candidates, feedback, setFeedback, markFound } = usePawPose()
  const pet = selectCandidatePet(pets, params.get('pet'))
  const scenario = requestedScenario === 'found' || Object.hasOwn(PREVIEW_OPTIONS, requestedScenario)
    ? requestedScenario : 'ready'

  function requestPreviewFocus() {
    restorePreviewFocus.current = true
  }

  function focusPreview(element) {
    if (element && restorePreviewFocus.current) {
      element.focus()
      restorePreviewFocus.current = false
    }
  }

  return { pet, candidates, scenario, feedback: feedback[pet?.id], setFeedback, markFound, requestPreviewFocus, focusPreview }
}

export function useCandidateResults({ pet, candidates, scenario, feedback, setFeedback, markFound }) {
  const [sort, setSort] = useState('score')
  const [retryPhase, setRetryPhase] = useState(null)
  const [previewFeedback, setPreviewFeedback] = useState(() => initialPreviewFeedback(candidates, scenario))
  const [focusRequest, setFocusRequest] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const undoButton = useRef(null)
  const heading = useRef(null)
  const summaryLinks = useRef(new Map())

  useEffect(() => {
    if (!['loading', 'analyzing'].includes(retryPhase)) return undefined
    const timer = window.setTimeout(() => setRetryPhase('ready'), retryPhase === 'analyzing' ? 10000 : 500)
    return () => window.clearTimeout(timer)
  }, [retryPhase])

  useEffect(() => {
    if (!focusRequest) return
    const target = focusRequest.target === 'undo' ? undoButton.current
      : focusRequest.target === 'header' ? heading.current
        : summaryLinks.current.get(focusRequest.target)
    target?.focus()
  }, [focusRequest])

  const phase = retryPhase ?? (pet ? scenario : 'pending')
  const found = phase === 'found' || (phase === 'ready' && pet?.status === 'found')
  const rankedCandidates = [...candidates].sort((left, right) => right.score - left.score)
  const allowedCandidates = phase === 'partial'
    ? rankedCandidates.filter((candidate) => candidate.type === 'shelter').slice(0, 2)
    : rankedCandidates
  const orderedCandidates = [...allowedCandidates].sort((left, right) => compareCandidates(left, right, sort))
  const isPreview = phase !== 'ready'
  const currentFeedback = isPreview ? previewFeedback : (feedback ?? {})
  const hiddenIds = Object.keys(currentFeedback).filter((id) => (
    currentFeedback[id] === 'hidden' && allowedCandidates.some((candidate) => candidate.id === id)
  ))
  const hiddenCount = hiddenIds.length
  const latestHiddenId = hiddenIds.at(-1)
  const visibleCandidates = orderedCandidates.filter((candidate) => currentFeedback[candidate.id] !== 'hidden')
  const pinnedCandidates = visibleCandidates.filter((candidate) => currentFeedback[candidate.id] === 'match')
  const otherCandidates = visibleCandidates.filter((candidate) => currentFeedback[candidate.id] !== 'match')
  const shownCandidates = found
    ? (pinnedCandidates.length ? pinnedCandidates : visibleCandidates.slice(0, 1))
    : otherCandidates
  const viewingList = found || ['ready', 'partial', 'feedback'].includes(phase)
  const count = found ? shownCandidates.length : visibleCandidates.length
  const countSuffix = found ? '' : hiddenCount ? ` · 숨김 ${hiddenCount}` : count && phase === 'ready' ? ' · 60% 이상' : ''
  const resultLabel = viewingList
    ? `후보 ${count}건${countSuffix}`
    : ({ loading: '불러오는 중', analyzing: '분석 중', error: '' }[phase] ?? '후보 0건')
  const lostDate = formatPetDate(pet?.lostDate, true)
  const statusText = [pet?.district || pet?.city, lostDate && `${lostDate} 실종`, pet ? (found ? '찾음' : '찾는 중') : ''].filter(Boolean).join(' · ')

  function showFeedback(candidateId, choice) {
    if (choice === 'found') {
      if (isPreview) setRetryPhase('found')
      else markFound(pet.id)
      setAnnouncement('찾음 처리되어 새로운 비교를 중단했어요')
      setFocusRequest({ target: 'header' })
      return
    }

    const candidateTitle = candidates.find((candidate) => candidate.id === candidateId)?.title
    if (isPreview) {
      setPreviewFeedback((previous) => {
        const next = { ...previous }
        delete next[candidateId]
        if (choice) next[candidateId] = choice
        return next
      })
    } else {
      setFeedback(pet.id, candidateId, choice)
    }
    if (choice === 'hidden') {
      setAnnouncement(`후보를 숨겼어요. 숨김 ${hiddenCount + 1}건`)
      setFocusRequest({ target: 'undo' })
      return
    }
    setAnnouncement(choice === 'match' ? `${candidateTitle} 후보를 목록 상단에 고정했어요` : `${candidateTitle} 후보를 복구했어요`)
    setFocusRequest({ target: candidateId })
  }

  function setFocusTarget(candidateId, element) {
    if (element) summaryLinks.current.set(candidateId, element)
    else summaryLinks.current.delete(candidateId)
  }

  return {
    sort, setSort, phase, found, hiddenCount, latestHiddenId, visibleCandidates, pinnedCandidates,
    shownCandidates, viewingList, resultLabel, statusText, announcement, heading, undoButton, showFeedback,
    setFocusTarget, retryAnalysis: () => setRetryPhase('analyzing'), retryLoading: () => setRetryPhase('loading'),
    precise: found || phase !== 'ready' || pinnedCandidates.length > 0 || hiddenCount > 0,
    unreadCount: !found && ['loading', 'ready', 'partial', 'feedback', 'error'].includes(phase) ? 2 : 0,
  }
}
