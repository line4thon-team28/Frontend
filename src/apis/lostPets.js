import { ApiError } from './client'
import { mockResponse } from './mocks/mockResponse'

let nextMockLostPetId = 1

function buildLostPetFormData({ photos, ...fields }) {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(fields)], { type: 'application/json' }))
  photos.forEach((photo) => formData.append('photos', photo))
  return formData
}

export async function createLostPet(lostPet) {
  const formData = buildLostPetFormData(lostPet)

  if (formData.getAll('photos').length === 0) {
    throw new ApiError('사진을 1장 이상 올려주세요', 'INVALID_INPUT', 400)
  }
  return mockResponse({ lostPetId: nextMockLostPetId++ }, 800)
}
