import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../apis/auth'
import headerWave from '../../assets/icons/header-wave.svg'
import kakaoIcon from '../../assets/icons/kakao.svg'
import mailIcon from '../../assets/icons/mail.svg'
import pawIcon from '../../assets/icons/paw.svg'
import BackButton from '../../components/BackButton/BackButton'
import Button from '../../components/Button/Button'
import FormAlert from '../../components/FormAlert/FormAlert'
import PasswordField from '../../components/PasswordField/PasswordField'
import TextField from '../../components/TextField/TextField'
import { TOKEN_EXPIRED_MESSAGE } from '../../constants/errorMessages'
import useAuth from '../../hooks/useAuth'
import { startKakaoLogin } from '../../utils/kakaoAuth'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const isExpired = location.state?.reason === 'expired'
  const returnPath = location.state?.from

  const [email, setEmail] = useState(location.state?.email ?? '')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = email.trim() !== '' && password !== '' && !isSubmitting

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    setErrorMessage('')
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      const { accessToken } = await login({ email: email.trim(), password })
      await signIn(accessToken)
      navigate(returnPath ?? '/home', { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={`${styles.circle} ${styles.circleTop}`} aria-hidden="true" />
        <span className={`${styles.circle} ${styles.circleLeft}`} aria-hidden="true" />
        <BackButton variant="overlay" className={styles.backButton} />
        <div className={styles.logoBox}>
          <img src={pawIcon} alt="" />
        </div>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>등록한 아이의 후보를 이어서 확인해요</p>
        <img src={headerWave} alt="" className={styles.wave} />
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {isExpired && (
          <p className={styles.expiredBanner} role="status">
            <span className={styles.expiredMark} aria-hidden="true">
              !
            </span>
            {TOKEN_EXPIRED_MESSAGE}
          </p>
        )}

        <div className={styles.fields}>
          <TextField
            label="이메일"
            icon={mailIcon}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="minji@example.com"
            value={email}
            onChange={handleEmailChange}
          />
          <PasswordField
            name="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        {errorMessage && <FormAlert className={styles.errorAlert}>{errorMessage}</FormAlert>}

        <Button type="submit" className={styles.submitButton} disabled={!canSubmit} aria-busy={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <Button variant="kakao" icon={kakaoIcon} className={styles.kakaoButton} onClick={() => startKakaoLogin(returnPath)}>
          카카오로 로그인
        </Button>
      </form>

      <p className={styles.footer}>
        아직 계정이 없나요?{' '}
        <Link to="/signup" className={styles.footerLink}>
          회원가입
        </Link>
      </p>
    </main>
  )
}
