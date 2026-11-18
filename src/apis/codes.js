import { MOCK_BREEDS } from './mocks/breeds'
import { mockResponse } from './mocks/mockResponse'
import { MOCK_REGIONS } from './mocks/regions'

export function fetchSidoList() {
  return mockResponse(MOCK_REGIONS.map(({ code, name }) => ({ code, name })))
}

export function fetchSigunguList(sidoCode) {
  const sido = MOCK_REGIONS.find((region) => region.code === sidoCode)
  const sigungus = sido ? sido.sigungus.map((name, index) => ({ code: `${sidoCode}-${index + 1}`, name })) : []
  return mockResponse(sigungus)
}

export function fetchBreeds(species) {
  return mockResponse(MOCK_BREEDS[species] ?? [])
}
