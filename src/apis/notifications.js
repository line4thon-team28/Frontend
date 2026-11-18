import { ApiError } from './client'
import { mockResponse } from './mocks/mockResponse'
import { MOCK_NOTIFICATIONS } from './mocks/notifications'

export function fetchNotifications({ page = 0, size = 20 } = {}) {
  const items = MOCK_NOTIFICATIONS.slice(page * size, page * size + size).map((item) => ({ ...item }))
  return mockResponse({
    items,
    page,
    size,
    totalCount: MOCK_NOTIFICATIONS.length,
    unreadCount: MOCK_NOTIFICATIONS.filter((item) => !item.read).length,
  })
}

export async function markNotificationRead(notificationId) {
  const notification = MOCK_NOTIFICATIONS.find((item) => item.notificationId === notificationId)
  if (!notification) {
    throw new ApiError('알림을 찾을 수 없어요', 'NOTIFICATION_NOT_FOUND', 404)
  }
  notification.read = true
  return mockResponse({ notificationId, read: true })
}
