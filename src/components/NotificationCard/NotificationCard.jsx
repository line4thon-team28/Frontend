import { Link } from 'react-router-dom'
import cameraIcon from '../../assets/icons/camera.svg'
import pawIcon from '../../assets/icons/paw-white.svg'
import { formatRelativeTime } from '../../utils/dateTime'
import styles from './NotificationCard.module.css'

const TYPE_DISPLAY = {
  NOTICE: { label: '보호소 공고', subject: '비슷한 보호소 공고가 올라왔어요', icon: pawIcon, tone: 'notice' },
  SIGHTING: { label: '목격 제보', subject: '비슷한 아이가 목격됐어요', icon: cameraIcon, tone: 'sighting' },
}

export default function NotificationCard({ notification, onOpen }) {
  const display = TYPE_DISPLAY[notification.matchType] ?? TYPE_DISPLAY.NOTICE
  const isUnread = !notification.read

  return (
    <Link
      to={`/candidates?pet=${encodeURIComponent(notification.lostPetId)}`}
      className={`${styles.card} ${isUnread ? styles.unread : styles.read}`}
      onClick={() => onOpen(notification)}
    >
      <span className={`${styles.thumb} ${styles[display.tone]}`} aria-hidden="true">
        <img src={display.icon} alt="" className={styles.thumbIcon} />
      </span>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.type}>
            {isUnread && (
              <>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.srOnly}>안 읽음</span>
              </>
            )}
            {display.label}
          </span>
          <time className={styles.time} dateTime={notification.createdAt}>
            {formatRelativeTime(notification.createdAt)}
          </time>
        </div>
        <p className={styles.title}>
          {Math.round(notification.similarity)}% {display.subject}
        </p>
        <p className={styles.description}>{notification.message}</p>
      </div>
    </Link>
  )
}
