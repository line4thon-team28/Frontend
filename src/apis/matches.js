import { request } from './client'
import { USE_MOCK_API } from './mocks/config'
import { getMockMatches, retryMockMatching, setMockFeedback } from './mocks/matches'
import { mockResponse } from './mocks/mockResponse'

export function fetchMatches(lostPetId, { sort = 'similarity', page = 0, size = 20 } = {}) {
  if (USE_MOCK_API) {
    return mockResponse(null, 500).then(() => getMockMatches(lostPetId, { sort, page, size }))
  }
  const params = new URLSearchParams({ sort, page, size })
  return request(`/lost-pets/${lostPetId}/matches?${params}`)
}

export function retryMatching(lostPetId) {
  if (USE_MOCK_API) {
    return mockResponse(null).then(() => retryMockMatching(lostPetId))
  }
  return request(`/lost-pets/${lostPetId}/matches/retry`, { method: 'POST' })
}

export function sendMatchFeedback(matchId, result) {
  if (USE_MOCK_API) {
    return mockResponse(null).then(() => setMockFeedback(matchId, result))
  }
  return request(`/matches/${matchId}/feedback`, { method: 'POST', body: { result } })
}
