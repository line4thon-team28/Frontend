import petA from '../../assets/images/pet-a.webp'
import petE from '../../assets/images/pet-e.webp'
import petG from '../../assets/images/pet-g.webp'
import { MOCK_REGIONS } from './regions'

const SECOND = 1000

export const MOCK_LOST_PETS = [
  {
    lostPetId: 1,
    name: '보리',
    species: 'CAT',
    breed: '코리안 숏헤어',
    sex: 'FEMALE',
    color: '치즈',
    lostDate: '2026-11-05',
    sidoCode: '6110000',
    sigunguName: '성북구',
    feature: '치즈 태비, 빨간 목줄, 왼쪽 귀 끝 살짝 접힘',
    imageUrl: petA,
    status: 'SEARCHING',
    matching: { status: 'PROCESSING', readyAt: Date.now() + 10 * SECOND },
  },
  {
    lostPetId: 2,
    name: '콩이',
    species: 'DOG',
    breed: '말티즈',
    sex: 'MALE',
    color: '흰색',
    lostDate: '2026-11-12',
    sidoCode: '6110000',
    sigunguName: '노원구',
    feature: '파란 하네스',
    imageUrl: petE,
    status: 'SEARCHING',
    matching: { status: 'FAILED', readyAt: null },
  },
  {
    lostPetId: 3,
    name: '나비',
    species: 'CAT',
    breed: '러시안 블루',
    sex: 'FEMALE',
    color: '회색',
    lostDate: '2026-10-28',
    sidoCode: '6110000',
    sigunguName: '강북구',
    feature: null,
    imageUrl: petG,
    status: 'FOUND',
    matching: { status: 'CANCELLED', readyAt: null },
  },
]

function findSigunguName(sidoCode, sigunguCode) {
  const sido = MOCK_REGIONS.find((region) => region.code === sidoCode)
  const index = Number(sigunguCode?.split('-')[1]) - 1
  return sido?.sigungus[index] ?? null
}

export function addMockLostPet(fields, imageUrl) {
  const lostPetId = Math.max(...MOCK_LOST_PETS.map((pet) => pet.lostPetId)) + 1
  MOCK_LOST_PETS.unshift({
    lostPetId,
    name: null,
    ...fields,
    sigunguName: findSigunguName(fields.sidoCode, fields.sigunguCode),
    imageUrl,
    status: 'SEARCHING',
    matching: { status: 'PROCESSING', readyAt: Date.now() + 10 * SECOND },
  })
  return lostPetId
}

export function findMockLostPet(lostPetId) {
  return MOCK_LOST_PETS.find((pet) => pet.lostPetId === Number(lostPetId))
}
