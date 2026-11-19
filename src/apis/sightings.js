import { request } from './client'
import { USE_MOCK_API } from './mocks/config'
import { mockResponse } from './mocks/mockResponse'
import { createMockSighting, getMockSightingResult } from './mocks/sightings'

function buildSightingForm({ photos, species, sido, sigungu, seenAt, memo }) {
  const formData = new FormData()
  photos.forEach((photo) => formData.append('photos', photo))
  formData.append('species', species)
  formData.append('sido', sido)
  formData.append('sigungu', sigungu)
  formData.append('seenAt', seenAt)
  if (memo) {
    formData.append('memo', memo)
  }
  return formData
}

export function createSighting(sighting) {
  const formData = buildSightingForm(sighting)
  if (USE_MOCK_API) {
    return mockResponse(null, 800).then(() => createMockSighting(formData))
  }
  return request('/sightings', { method: 'POST', body: formData })
}

export function fetchSightingResult(sightingId) {
  if (USE_MOCK_API) {
    return mockResponse(null).then(() => getMockSightingResult(sightingId))
  }
  return request(`/sightings/${sightingId}`)
}
