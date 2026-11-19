import { request } from './client'

export function fetchNotifications({ page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size })
  return request(`/notifications?${params}`)
}

export function fetchUnreadNotificationCount() {
  return request('/notifications/unread-count')
}

export function markNotificationRead(notificationId) {
  return request(`/notifications/${notificationId}/read`, { method: 'PATCH' })
}
