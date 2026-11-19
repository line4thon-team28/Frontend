import { Link } from 'react-router-dom'
import styles from './NotificationBell.module.css'

export default function NotificationBell({ unreadCount = 0 }) {
  const label = unreadCount > 0 ? `알림, 안 읽은 알림 ${unreadCount}개` : '알림'

  return (
    <Link to="/notifications" className={styles.bell} aria-label={label}>
      <span className={styles.bellShape} aria-hidden="true" />
      {unreadCount > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
