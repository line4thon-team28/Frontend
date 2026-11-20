import { useState } from 'react'
import { Link } from 'react-router-dom'
import cameraIcon from '../../assets/icons/camera.svg'
import pawIcon from '../../assets/icons/paw-white.svg'
import { formatDayAndClock, formatRelativeTime } from '../../utils/dateTime'
import styles from './NotificationCard.module.css'

const TYPE_DISPLAY = {
  NOTICE: { label: '보호소 공고', icon: pawIcon, tone: 'notice' },
  SIGHTING: { label: '목격 제보', icon: cameraIcon, tone: 'sighting' },
}

function withAndParticle(name) {
  const code = name.charCodeAt(name.length - 1) - 0xac00
  const hasFinalConsonant = code >= 0 && code <= 11171 && code % 28 !== 0
  return `${name}${hasFinalConsonant ? '과' : '와'}`
}

function toDistrict(place) {
  const words = place?.trim().split(/\s+/) ?? []
  return words[1] ?? words[0]
}

function formatDeadline(daysLeft) {
  if (daysLeft == null) return null
  return daysLeft === 0 ? '오늘 마감' : `마감까지 ${daysLeft}일`
}

function describeNotice(notification, petName, match) {
  const similarity = `${Math.round(notification.similarity)}%`
  const title = petName
    ? `${withAndParticle(petName)} ${similarity} 비슷한 공고가 올라왔어요`
    : `${similarity} 비슷한 공고가 올라왔어요`
  const description = match?.shelterName
    ? [match.shelterName, formatDeadline(match.daysLeft)].filter(Boolean).join(' · ')
    : notification.message
  return { title, description }
}

function describeSighting(notification, match) {
  const district = toDistrict(match?.place)
  const title = district ? `비슷한 아이가 ${district}에서 목격됐어요` : '비슷한 아이가 목격됐어요'
  const description = `유사도 ${Math.round(notification.similarity)}% · ${formatDayAndClock(new Date(notification.createdAt))}`
  return { title, description }
}

export default function NotificationCard({ notification, pet, match, onOpen }) {
  const isSighting = notification.matchType === 'SIGHTING'
  const display = TYPE_DISPLAY[notification.matchType] ?? TYPE_DISPLAY.NOTICE
  const { title, description } = isSighting
    ? describeSighting(notification, match)
    : describeNotice(notification, pet?.name, match)
  const isUnread = !notification.read
  const photo = pet?.photo
  const [brokenPhoto, setBrokenPhoto] = useState(null)
  const showPhoto = Boolean(photo) && brokenPhoto !== photo

  return (
    <Link
      to={`/candidates?pet=${encodeURIComponent(notification.lostPetId)}`}
      className={`${styles.card} ${isUnread ? styles.unread : styles.read}`}
      onClick={() => onOpen(notification)}
    >
      {showPhoto ? (
        <img src={photo} alt="" className={styles.photo} onError={() => setBrokenPhoto(photo)} />
      ) : (
        <span className={`${styles.thumb} ${styles[display.tone]}`} aria-hidden="true">
          <img src={display.icon} alt="" className={styles.thumbIcon} />
        </span>
      )}
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
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  )
}
