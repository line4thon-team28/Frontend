import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import pawIcon from '../../assets/icons/paw.svg'
import useAuth from '../../hooks/useAuth'
import styles from './SplashPage.module.css'

const MINIMUM_SPLASH_MS = 1200

export default function SplashPage() {
  const navigate = useNavigate()
  const { status } = useAuth()
  const [isMinimumTimeOver, setIsMinimumTimeOver] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMinimumTimeOver(true), MINIMUM_SPLASH_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isMinimumTimeOver || status === 'checking') return
    navigate(status === 'authenticated' ? '/home' : '/start', { replace: true })
  }, [isMinimumTimeOver, status, navigate])

  return (
    <main className={styles.splash}>
      <span className={`${styles.decoration} ${styles.decorationTop}`} aria-hidden="true" />
      <span className={`${styles.decoration} ${styles.decorationBottom}`} aria-hidden="true" />

      <div className={styles.brand}>
        <div className={styles.logoBox}>
          <img src={pawIcon} alt="" className={styles.logoIcon} />
        </div>
        <h1 className={styles.title}>포포즈</h1>
        <p className={styles.subtitle}>PAWPOSE</p>
      </div>

      <div className={styles.loadingDots} role="status" aria-label="불러오는 중">
        <span />
        <span />
        <span />
      </div>
    </main>
  )
}
