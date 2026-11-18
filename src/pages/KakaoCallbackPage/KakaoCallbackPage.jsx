import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { kakaoLogin } from '../../apis/auth'
import errorIcon from '../../assets/icons/error.svg'
import kakaoIcon from '../../assets/icons/kakao.svg'
import BackButton from '../../components/BackButton/BackButton'
import Button from '../../components/Button/Button'
import { KAKAO_LOGIN_FAILED_MESSAGE } from '../../constants/errorMessages'
import useAuth from '../../hooks/useAuth'
import { startKakaoLogin, takeKakaoReturnPath } from '../../utils/kakaoAuth'
import styles from './KakaoCallbackPage.module.css'

export default function KakaoCallbackPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const hasRequested = useRef(false)
  const returnPath = useRef(null)
  const [code] = useState(() => new URLSearchParams(window.location.search).get('code'))
  const [errorMessage, setErrorMessage] = useState(code ? '' : KAKAO_LOGIN_FAILED_MESSAGE)

  useEffect(() => {
    if (hasRequested.current) return
    hasRequested.current = true
    returnPath.current = takeKakaoReturnPath()
    if (!code) return

    kakaoLogin(code)
      .then(({ accessToken }) => signIn(accessToken))
      .then(() => navigate(returnPath.current ?? '/home', { replace: true }))
      .catch((error) => setErrorMessage(error.message))
  }, [code, navigate, signIn])

  if (!errorMessage) {
    return (
      <main className={styles.page}>
        <div className={styles.center} role="status">
          <div className={styles.loadingRing}>
            <span className={styles.kakaoBadge}>
              <img src={kakaoIcon} alt="" />
            </span>
          </div>
          <h1 className={styles.loadingTitle}>카카오 계정으로 로그인 중이에요</h1>
          <p className={styles.loadingText}>잠시만 기다려 주세요.</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <BackButton className={styles.backButton} />
      <div className={styles.center}>
        <div className={styles.errorBadge}>
          <img src={errorIcon} alt="" />
        </div>
        <h1 className={styles.errorTitle} role="alert">
          {errorMessage}
        </h1>
        <div className={styles.actions}>
          <Button variant="kakao" icon={kakaoIcon} className={styles.kakaoButton} onClick={() => startKakaoLogin(returnPath.current)}>
            카카오로 다시 로그인
          </Button>
          <Button
            variant="outline"
            className={styles.emailButton}
            onClick={() => navigate('/login', { replace: true, state: { from: returnPath.current ?? undefined } })}
          >
            이메일로 로그인
          </Button>
        </div>
      </div>
    </main>
  )
}
