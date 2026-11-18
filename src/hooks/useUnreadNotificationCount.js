import { useEffect, useState } from 'react'
import { fetchNotifications } from '../apis/notifications'

export default function useUnreadNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let ignore = false
    fetchNotifications({ size: 1 })
      .then(({ unreadCount: count }) => !ignore && setUnreadCount(count))
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  return unreadCount
}
