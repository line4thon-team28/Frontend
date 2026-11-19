import useAuth from './useAuth'
import usePawPose from '../mocks/usePawPose'
import useMockScenario from '../mocks/useMockScenario'

export const PREVIEW_OPTIONS = { loading: '35 로딩', empty: '36 빈 상태', error: '37 조회 오류' }

export default function useMyRegistrationsPage() {
  const { pets, candidates, feedback, markFound } = usePawPose()
  const { user } = useAuth()
  const { scenario, setScenario } = useMockScenario()
  const loading = scenario === 'loading'
  const error = scenario === 'error'
  const empty = scenario === 'empty' || pets.length === 0
  const nickname = user?.nickname || '민지'
  const searchingPets = pets.filter((pet) => pet.status !== 'found')
  const foundPets = pets.filter((pet) => pet.status === 'found')

  return {
    candidates, feedback, markFound, loading, error, empty, nickname, searchingPets, foundPets,
    retry: () => setScenario(''),
  }
}
