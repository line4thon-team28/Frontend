import { ApiError } from './client'
import { addMockLostPet, findMockLostPet, MOCK_LOST_PETS } from './mocks/lostPets'
import { mockResponse } from './mocks/mockResponse'

function buildLostPetFormData({ photos, ...fields }) {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(fields)], { type: 'application/json' }))
  photos.forEach((photo) => formData.append('photos', photo))
  return formData
}

function toLostPetSummary({ matching, ...lostPet }) {
  return { ...lostPet, matchingStatus: matching.status }
}

export async function createLostPet(lostPet) {
  const formData = buildLostPetFormData(lostPet)
  const [firstPhoto] = formData.getAll('photos')

  if (!firstPhoto) {
    throw new ApiError('사진을 1장 이상 올려주세요', 'INVALID_INPUT', 400)
  }
  const fields = JSON.parse(await formData.get('request').text())
  const lostPetId = addMockLostPet(fields, URL.createObjectURL(firstPhoto))
  return mockResponse({ lostPetId }, 800)
}

export function fetchMyLostPets() {
  return mockResponse(MOCK_LOST_PETS.map(toLostPetSummary))
}

export async function fetchLostPet(lostPetId) {
  const lostPet = findMockLostPet(lostPetId)
  if (!lostPet) {
    throw new ApiError('실종 등록을 찾을 수 없어요', 'LOST_PET_NOT_FOUND', 404)
  }
  return mockResponse(toLostPetSummary(lostPet))
}
