import { useNavigate, useParams } from 'react-router-dom'
import useMockScenario from '../mocks/useMockScenario'
import usePawPose, { selectCandidatePet } from '../mocks/usePawPose'
import { candidatesPath } from '../routes/petPaths'

export const SHELTER_PREVIEWS = { 'no-phone': '28 전화번호 없음', closed: '29 공고 종료' }

export default function useCandidateDetailPage() {
  const { candidateId } = useParams()
  const { params, scenario, setScenario } = useMockScenario()
  const navigate = useNavigate()
  const { pets, candidates, setFeedback } = usePawPose()
  const candidate = candidates.find(({ id }) => id === candidateId)
  const pet = selectCandidatePet(pets, params.get('pet'))
  const backTo = candidatesPath(pet?.id)
  if (!candidate) return { candidate, backTo }


  const isSighting = candidate.type === 'sighting'
  const closed = !isSighting && (scenario === 'closed' || (scenario !== 'no-phone' && candidate.closed))
  const phone = scenario === 'no-phone' ? '' : candidate.phone
  const mapUrl = candidate.address ? `https://map.kakao.com/link/search/${encodeURIComponent(candidate.address)}` : ''
  const shelter = scenario === 'no-phone' ? { ...candidate, deadlineDays: 2 } : candidate
  const feedbackEnabled = Boolean(pet && pet.status !== 'found')

  function toggleShelterPreview(value) {
    setScenario(scenario === value ? '' : value)
  }

  const handleFeedback = (value) => {
    if (!feedbackEnabled) return
    setFeedback(pet.id, candidate.id, value)
    navigate(backTo, { replace: true, state: value === 'hidden' ? { hiddenCandidateId: candidate.id } : undefined })
  }

  return {
    candidate, pet, backTo, isSighting, closed, phone, mapUrl, shelter,
    scenario, feedbackEnabled, toggleShelterPreview, handleFeedback,
  }
}
