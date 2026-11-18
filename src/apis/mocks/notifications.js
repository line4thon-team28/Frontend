import petD from '../../assets/images/pet-d.webp'
import petF from '../../assets/images/pet-f.webp'
import petG from '../../assets/images/pet-g.webp'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const now = Date.now()
const yesterdayNoon = new Date(now)
yesterdayNoon.setDate(yesterdayNoon.getDate() - 1)
yesterdayNoon.setHours(12, 0, 0, 0)

export const MOCK_NOTIFICATIONS = [
  {
    notificationId: 3,
    type: 'NOTICE',
    lostPetId: 1,
    lostPetName: '보리',
    matchId: 101,
    imageUrl: petF,
    similarity: 0.924,
    shelterName: '강북구 동물보호센터',
    place: '강북구 수유동',
    occurredAt: '2026-11-07T00:00:00',
    daysLeft: 7,
    read: false,
    createdAt: new Date(now - 2 * MINUTE).toISOString(),
  },
  {
    notificationId: 2,
    type: 'SIGHTING',
    lostPetId: 1,
    lostPetName: '보리',
    matchId: 102,
    imageUrl: petG,
    similarity: 0.781,
    shelterName: null,
    place: '성북구 정릉동',
    occurredAt: new Date(now - 2 * HOUR).toISOString(),
    daysLeft: null,
    read: false,
    createdAt: new Date(now - HOUR).toISOString(),
  },
  {
    notificationId: 1,
    type: 'NOTICE',
    lostPetId: 1,
    lostPetName: '보리',
    matchId: 103,
    imageUrl: petD,
    similarity: 0.713,
    shelterName: '동대문구 동물보호센터',
    place: '동대문구 장안동',
    occurredAt: '2026-11-06T00:00:00',
    daysLeft: 9,
    read: true,
    createdAt: yesterdayNoon.toISOString(),
  },
]
