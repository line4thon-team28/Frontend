import { Outlet } from 'react-router-dom'
import BottomTabBar from '../../components/BottomTabBar/BottomTabBar'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  )
}
