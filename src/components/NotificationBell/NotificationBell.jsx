import { Link } from 'react-router-dom'
import useUnreadNotificationCount from '../../hooks/useUnreadNotificationCount'
import styles from './NotificationBell.module.css'

export default function NotificationBell({ showBadge = true }) {
  const unreadCount = useUnreadNotificationCount()
  const hasBadge = showBadge && unreadCount > 0
  const label = hasBadge ? `알림, 안 읽은 알림 ${unreadCount}개` : '알림'

  return (
    <Link to="/notifications" className={styles.bell} aria-label={label}>
      <span className={styles.bellShape} aria-hidden="true" />
      {hasBadge && (
        <span className={styles.badge} aria-hidden="true">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
