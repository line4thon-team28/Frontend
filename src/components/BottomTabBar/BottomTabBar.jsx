import { NavLink } from 'react-router-dom'
import { MAIN_TABS } from '../../constants/tabs'
import styles from './BottomTabBar.module.css'

export default function BottomTabBar() {
  return (
    <nav className={styles.tabBar} aria-label="주요 메뉴">
      <ul className={styles.tabList}>
        {MAIN_TABS.map(({ to, label, shape }) => (
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
