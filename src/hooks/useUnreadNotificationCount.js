import { useEffect, useState } from 'react'
import { fetchUnreadNotificationCount } from '../apis/notifications'

export default function useUnreadNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let ignore = false
    fetchUnreadNotificationCount()
      .then(({ count }) => !ignore && setUnreadCount(count))
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  return unreadCount
}
