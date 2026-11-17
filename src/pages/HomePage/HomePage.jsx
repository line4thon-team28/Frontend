import { Link } from 'react-router-dom'
import cameraIcon from '../../assets/icons/camera.svg'
import searchIcon from '../../assets/icons/search.svg'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import useAuth from '../../hooks/useAuth'
import styles from './HomePage.module.css'

const ACTION_CARDS = [
  {
    to: '/lost-pets/new',
    title: '잃어버렸어요',
    description: '사진과 실종 정보로 등록하기',
    icon: searchIcon,
    tone: 'primary',
  },
  {
    to: '/sightings/new',
    title: '목격했어요',
    description: '로그인 없이 사진·위치만 제보',
    icon: cameraIcon,
    tone: 'dark',
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const greeting = user?.nickname ? `${user.nickname}님, 안녕하세요` : '안녕하세요'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>{greeting}</p>
          <h1 className={styles.title}>무엇을 도와드릴까요?</h1>
        </div>
        <NotificationBell />
      </header>

      <p className={styles.description}>사진 한 장이면 전국 보호소 공고와 목격 제보를 대신 찾아봐요.</p>

      <ul className={styles.cards}>
        {ACTION_CARDS.map(({ to, title, description, icon, tone }) => (
          <li key={to}>
            <Link to={to} className={`${styles.card} ${styles[tone]}`}>
              <span className={styles.cardDecoration} aria-hidden="true" />
              <span className={styles.cardIcon} aria-hidden="true">
                <img src={icon} alt="" />
              </span>
              <span className={styles.cardTitle}>{title}</span>
              <span className={styles.cardDescription}>{description}</span>
              <span className={styles.cardArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
