import { NavLink } from 'react-router-dom'
import styles from './BottomTabBar.module.css'

const TABS = [
  { to: '/home', label: '홈', shape: 'square' },
  { to: '/candidates', label: '후보', shape: 'circle' },
  { to: '/notifications', label: '알림', shape: 'square' },
  { to: '/my', label: '내 등록', shape: 'circle' },
]

export default function BottomTabBar() {
  return (
    <nav className={styles.tabBar} aria-label="주요 메뉴">
      <ul className={styles.tabList}>
        {TABS.map(({ to, label, shape }) => (
          <li key={to}>
            <NavLink to={to} className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
              <span className={`${styles.tabIcon} ${styles[shape]}`} aria-hidden="true" />
              <span className={styles.tabLabel}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
