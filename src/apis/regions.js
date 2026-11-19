import { request } from './client'
import { USE_MOCK_API } from './mocks/config'
import { mockResponse } from './mocks/mockResponse'
import { MOCK_REGIONS } from './mocks/regions'

function getMockRegions(sidoCode) {
  if (!sidoCode) {
    return MOCK_REGIONS.map(({ code, name }) => ({ sidoCode: code, name, sigungu: [], districtMode: 'SELECT_PROVINCE' }))
  }
  return MOCK_REGIONS.filter(({ code }) => code === sidoCode).map(({ code, name, sigungus }) => ({
    sidoCode: code,
    name,
    sigungu: sigungus.map((sigunguName) => ({ code: sigunguName, name: sigunguName })),
    districtMode: 'OFFICIAL',
  }))
}

export function fetchProvinces() {
  if (USE_MOCK_API) {
    return mockResponse(getMockRegions())
  }
  return request('/regions')
}

export async function fetchDistricts(sidoCode) {
  const provinces = USE_MOCK_API
    ? await mockResponse(getMockRegions(sidoCode))
    : await request(`/regions?sido=${encodeURIComponent(sidoCode)}`)
  const province = provinces?.[0]
  return {
    districts: province?.sigungu ?? [],
    isManual: province?.districtMode === 'MANUAL',
  }
}
