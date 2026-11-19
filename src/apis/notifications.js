import { request } from './client'
import { USE_MOCK_API } from './mocks/config'
import { mockResponse } from './mocks/mockResponse'
import { getMockNotifications, getMockUnreadCount, markMockNotificationRead } from './mocks/notifications'

export function fetchNotifications({ page = 0, size = 20 } = {}) {
  if (USE_MOCK_API) {
    return mockResponse(null, 500).then(() => getMockNotifications(page, size))
  }
  const params = new URLSearchParams({ page, size })
  return request(`/notifications?${params}`)
}

export function fetchUnreadNotificationCount() {
  if (USE_MOCK_API) {
    return mockResponse(null).then(() => getMockUnreadCount())
  }
  return request('/notifications/unread-count')
}

export function markNotificationRead(notificationId) {
  if (USE_MOCK_API) {
    return mockResponse(null).then(() => markMockNotificationRead(notificationId))
  }
  return request(`/notifications/${notificationId}/read`, { method: 'PATCH' })
}
