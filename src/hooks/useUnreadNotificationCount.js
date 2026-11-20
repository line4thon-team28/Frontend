import { useEffect, useState } from 'react'
import { fetchUnreadNotificationCount } from '../apis/notifications'

export default function useUnreadNotificationCount(enabled = true) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let ignore = false
    function refresh() {
      fetchUnreadNotificationCount()
        .then(({ count }) => !ignore && setUnreadCount(count))
        .catch(() => {})
    }
    refresh()
    window.addEventListener('notification-read', refresh)
    return () => {
      ignore = true
      window.removeEventListener('notification-read', refresh)
    }
  }, [enabled])

  return unreadCount
}
