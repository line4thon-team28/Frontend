import { Link } from 'react-router-dom'
import { formatDayAndTime, formatRelativeTime, withParticle } from '../../utils/format'
import styles from './NotificationCard.module.css'

function getTexts(notification) {
  const percent = `${Math.floor(notification.similarity * 100)}%`

  if (notification.type === 'NOTICE') {
    const name = notification.lostPetName ?? '우리 아이'
    const details = [notification.shelterName, notification.daysLeft !== null && `마감까지 ${notification.daysLeft}일`]
    return {
      typeLabel: '보호소 공고',
      title: `${withParticle(name, '과', '와')} ${percent} 비슷한 공고가 올라왔어요`,
      description: details.filter(Boolean).join(' · '),
    }
  }

  const area = notification.place?.split(' ').at(-1)
  return {
    typeLabel: '목격 제보',
    title: area ? `비슷한 아이가 ${area}에서 목격됐어요` : '비슷한 아이가 목격됐어요',
    description: `유사도 ${percent} · ${formatDayAndTime(notification.occurredAt)}`,
  }
}

export default function NotificationCard({ notification, onOpen }) {
  const { typeLabel, title, description } = getTexts(notification)
  const isUnread = !notification.read

  return (
    <Link
      to={`/lost-pets/${notification.lostPetId}/matches`}
      className={`${styles.card} ${isUnread ? styles.unread : styles.read}`}
      onClick={() => onOpen(notification)}
    >
      <img src={notification.imageUrl} alt="" className={styles.photo} />
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.type}>
            {isUnread && (
              <>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.srOnly}>안 읽음</span>
              </>
            )}
            {typeLabel}
          </span>
          <time className={styles.time} dateTime={notification.createdAt}>
            {formatRelativeTime(notification.createdAt)}
          </time>
        </div>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  )
}
