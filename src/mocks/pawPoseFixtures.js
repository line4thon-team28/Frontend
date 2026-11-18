import boriPhoto from '../assets/images/pet-a.webp'
import kongPhoto from '../assets/images/pet-e.webp'
import otherPetPhoto from '../assets/images/pet-g.webp'

export const initialPets = [
  {
    id: 'bori', name: '보리', species: '고양이', breed: '코리안 숏헤어', sex: '암컷', coat: '치즈',
    lostDate: '2026-11-05', city: '서울특별시', district: '성북구',
    features: '치즈 태비, 빨간 목줄, 왼쪽 귀 끝 살짝 접힘. 겁이 많아요.', contact: '010-1234-5678',
    photo: boriPhoto, photoCount: 3, status: 'searching', foundDate: null,
  },
  {
    id: 'kong', name: '콩이', species: '개', breed: '믹스', sex: '수컷', coat: '흰색',
    lostDate: '2026-03-10', city: '서울특별시', district: '성북구', features: '', contact: '',
    photo: kongPhoto, photoCount: 1, status: 'found', foundDate: '2026-03-12',
  },
]

const shelterDefaults = {
  type: 'shelter', species: '고양이', breed: '코리안 숏헤어', sex: '암컷', coat: '치즈',
  age: '2세 추정', weight: '3.8kg', closed: false,
  supplies: '반려동물 사진 여러 장 · 신분증 · 동물등록증(있으면)',
}

export const candidates = [
  {
    ...shelterDefaults,
    id: 'shelter-gangbuk', title: '강북구 동물보호센터', facility: '강북구 동물보호센터',
    photo: otherPetPhoto, score: 92.4, location: '강북구 수유동', reportedAt: '11월 7일 발견',
    deadlineDays: 7, deadlineDate: '2026. 11. 15', announcementId: '서울-강북-2026-00231',
    description: '붉은색 목줄 착용, 사람을 잘 따름. 강북구 수유동 주택가 골목에서 발견.',
    address: '서울 강북구 덕릉로 123', phone: '02-901-1234',
  },
  {
    id: 'sighting-jeongneung', type: 'sighting', title: '목격 제보 · 정릉동',
    photo: boriPhoto, score: 78, location: '성북구 정릉동', reportedAt: '오늘 08:40',
    note: '빨간 목줄, 사람 경계. 정릉시장 뒤 골목 주차장 쪽으로 이동했어요.',
  },
  {
    ...shelterDefaults,
    id: 'shelter-dongdaemun', title: '동대문구 동물보호센터', facility: '동대문구 동물보호센터',
    photo: kongPhoto, score: 71.3, location: '동대문구 장안동', reportedAt: '11월 6일 발견',
    deadlineDays: 2, deadlineDate: '2026. 11. 10', announcementId: '서울-동대문-2026-00232',
    description: '사람을 잘 따름. 동대문구 장안동 주택가에서 발견.',
    address: '서울 동대문구 장한로 25', phone: '',
  },
  {
    ...shelterDefaults,
    id: 'shelter-nowon', title: '노원구 동물보호센터', facility: '노원구 동물보호센터',
    photo: boriPhoto, score: 64.8, location: '노원구 공릉동', reportedAt: '11월 8일 발견',
    deadlineDays: 10, deadlineDate: '2026. 11. 18', announcementId: '서울-노원-2026-00233',
    description: '노원구 공릉동에서 발견되었어요.', address: '서울 노원구 동일로 123', phone: '02-2116-1234',
  },
  {
    ...shelterDefaults,
    id: 'shelter-seongbuk', title: '성북구 동물보호센터', facility: '성북구 동물보호센터',
    photo: otherPetPhoto, score: 61.2, location: '성북구 길음동', reportedAt: '11월 5일 발견',
    deadlineDays: 0, deadlineDate: '2026. 11. 8', announcementId: '서울-성북-2026-00234',
    description: '성북구 길음동에서 발견된 뒤 보호자에게 반환되었어요.',
    address: '서울 성북구 보문로 168', phone: '02-2241-1234', closed: true,
  },
]
