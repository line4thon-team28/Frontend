import { request } from './client'
import { USE_MOCK_API } from './mocks/config'
import { getMockMyLostPets } from './mocks/lostPets'
import { mockResponse } from './mocks/mockResponse'

export function fetchMyLostPets() {
  if (USE_MOCK_API) {
    return mockResponse(null).then(() => getMockMyLostPets())
  }
  return request('/lost-pets/me')
}
