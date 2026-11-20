import { request } from './client'

export function fetchProvinces() {
  return request('/regions')
}

export async function fetchDistricts(sidoCode) {
  const provinces = await request(`/regions?sido=${encodeURIComponent(sidoCode)}`)
  const province = provinces?.[0]
  return {
    districts: province?.sigungu ?? [],
    isManual: province?.districtMode === 'MANUAL',
  }
}
