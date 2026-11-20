import { request } from './client'

function buildSightingForm({ photos, species, sido, sigungu, seenAt, place, memo, breed, color }) {
  const formData = new FormData()
  photos.forEach((photo) => formData.append('photos', photo))
  formData.append('species', species)
  formData.append('sido', sido)
  formData.append('sigungu', sigungu)
  formData.append('seenAt', seenAt)
  for (const [field, value] of Object.entries({ place, memo, breed, color })) {
    const text = value?.trim()
    if (text) formData.append(field, text)
  }
  return formData
}

export function createSighting(sighting) {
  const formData = buildSightingForm(sighting)
  return request('/sightings', { method: 'POST', body: formData })
}

export function fetchSightingResult(sightingId) {
  return request(`/sightings/${sightingId}`)
}
