import { toLocalDateTimeValue } from '../../utils/dateTime'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const NOTICE_MESSAGE = '보호소 공고에서 우리 아이와 비슷한 아이를 찾았어요'
const SIGHTING_MESSAGE = '우리 아이와 비슷한 아이를 봤다는 목격 제보가 있어요'

function toServerDateTime(date) {
  return `${toLocalDateTimeValue(date)}:00`
}

const now = Date.now()
const yesterdayNoon = new Date(now)
yesterdayNoon.setDate(yesterdayNoon.getDate() - 1)
yesterdayNoon.setHours(12, 0, 0, 0)
const lastWeek = new Date(now - 6 * 24 * HOUR)

const notifications = [
  {
    notificationId: 4,
    lostPetId: 1,
    matchId: 101,
    matchType: 'NOTICE',
    similarity: 92.4,
    message: NOTICE_MESSAGE,
    read: false,
    createdAt: toServerDateTime(new Date(now - 2 * MINUTE)),
    readAt: null,
  },
  {
    notificationId: 3,
    lostPetId: 1,
    matchId: 102,
    matchType: 'SIGHTING',
    similarity: 78.1,
    message: SIGHTING_MESSAGE,
    read: false,
    createdAt: toServerDateTime(new Date(now - HOUR)),
    readAt: null,
  },
  {
    notificationId: 2,
    lostPetId: 1,
    matchId: 103,
    matchType: 'NOTICE',
    similarity: 71.3,
    message: NOTICE_MESSAGE,
    read: true,
    createdAt: toServerDateTime(yesterdayNoon),
    readAt: toServerDateTime(yesterdayNoon),
  },
  {
    notificationId: 1,
    lostPetId: 1,
    matchId: 104,
    matchType: 'SIGHTING',
    similarity: 64.8,
    message: SIGHTING_MESSAGE,
    read: true,
    createdAt: toServerDateTime(lastWeek),
    readAt: toServerDateTime(lastWeek),
  },
]

export function getMockNotifications(page, size) {
  const items = notifications.slice(page * size, page * size + size).map((item) => ({ ...item }))
  return {
    items,
    page,
    size,
    totalCount: notifications.length,
    hasNext: (page + 1) * size < notifications.length,
  }
}

export function getMockUnreadCount() {
  return { count: notifications.filter((item) => !item.read).length }
}

export function markMockNotificationRead(notificationId) {
  const notification = notifications.find((item) => item.notificationId === notificationId)
  if (!notification) {
    throw new Error('MOCK_NOTIFICATION_NOT_FOUND')
  }
  notification.read = true
  notification.readAt = toServerDateTime(new Date())
  return { ...notification }
}
