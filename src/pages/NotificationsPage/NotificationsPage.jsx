import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNotifications, markNotificationRead } from '../../apis/notifications'
import bellIcon from '../../assets/icons/bell.svg'
import errorIcon from '../../assets/icons/error.svg'
import refreshIcon from '../../assets/icons/refresh.svg'
import Button from '../../components/Button/Button'
import NotificationCard from '../../components/NotificationCard/NotificationCard'
import StatusView from '../../components/StatusView/StatusView'
import { getDayGroup } from '../../utils/dateTime'
import styles from './NotificationsPage.module.css'

const SKELETON_COUNT = 4

function groupByDay(notifications) {
  return notifications.reduce((groups, notification) => {
    const label = getDayGroup(notification.createdAt)
    const group = groups.find((item) => item.label === label)
    if (group) {
      group.items.push(notification)
    } else {
      groups.push({ label, items: [notification] })
    }
    return groups
  }, [])
}

function NotificationSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <span className={`${styles.skeletonBlock} ${styles.skeletonPhoto}`} />
      <div className={styles.skeletonLines}>
        <span className={`${styles.skeletonBlock} ${styles.skeletonShort}`} />
        <span className={`${styles.skeletonBlock} ${styles.skeletonLong}`} />
        <span className={`${styles.skeletonBlock} ${styles.skeletonMedium}`} />
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [reloadToken, setReloadToken] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchNotifications()
      .then((data) => !ignore && setResult({ token: reloadToken, items: data.items }))
      .catch((error) => !ignore && setResult({ token: reloadToken, error }))
    return () => {
      ignore = true
    }
  }, [reloadToken])

  const handleOpen = (notification) => {
    if (!notification.read) {
      markNotificationRead(notification.notificationId).catch(() => {})
    }
  }

  const isLoading = result?.token !== reloadToken

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className={styles.list} aria-busy="true" aria-label="알림을 불러오는 중">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </div>
      )
    }

    if (result.error) {
      return (
        <div className={styles.centered}>
          <StatusView
            icon={errorIcon}
            tone="error"
            title="알림을 불러오지 못했어요"
            description={result.error.message}
            action={
              <Button variant="dark" size="medium" icon={refreshIcon} onClick={() => setReloadToken((token) => token + 1)}>
                다시 시도
              </Button>
            }
          />
        </div>
      )
    }

    if (result.items.length === 0) {
      return (
        <div className={styles.centered}>
          <StatusView
            icon={bellIcon}
            title="아직 알림이 없어요"
            description={'새 후보나 목격 제보가 생기면\n여기와 위쪽 종 아이콘 숫자로 알려드려요.'}
            action={
              <Button variant="outline" size="medium" className={styles.emptyButton} onClick={() => navigate('/candidates')}>
                후보 목록 보기
              </Button>
            }
          />
        </div>
      )
    }

    return groupByDay(result.items).map((group) => (
      <section key={group.label} className={styles.group} aria-label={group.label}>
        <h2 className={styles.groupTitle}>{group.label}</h2>
        <ul className={styles.list}>
          {group.items.map((notification) => (
            <li key={notification.notificationId}>
              <NotificationCard notification={notification} onOpen={handleOpen} />
            </li>
          ))}
        </ul>
      </section>
    ))
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>알림</h1>
      <div className={styles.body}>{renderBody()}</div>
    </div>
  )
}
