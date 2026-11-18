import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../apis/auth'
import checkIcon from '../../assets/icons/check.svg'
import kakaoIcon from '../../assets/icons/kakao.svg'
import mailIcon from '../../assets/icons/mail.svg'
import userIcon from '../../assets/icons/user.svg'
import BackButton from '../../components/BackButton/BackButton'
import Button from '../../components/Button/Button'
import FormAlert from '../../components/FormAlert/FormAlert'
import PasswordField from '../../components/PasswordField/PasswordField'
import TextField from '../../components/TextField/TextField'
import useAuth from '../../hooks/useAuth'
import { startKakaoLogin } from '../../utils/kakaoAuth'
import { findFieldOfMessage, isPasswordLengthValid, validateSignup } from '../../utils/validateSignup'
import styles from './SignupPage.module.css'

const EMPTY_ERRORS = { email: '', password: '', nickname: '' }

export default function SignupPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [values, setValues] = useState({ email: '', password: '', nickname: '' })
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const payload = {
      email: values.email.trim(),
      password: values.password,
      nickname: values.nickname.trim(),
    }
    const errors = validateSignup(payload)
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const { accessToken } = await signup(payload)
      await signIn(accessToken)
      navigate('/home', { replace: true })
    } catch (error) {
      const field = error.code === 'EMAIL_DUPLICATED' ? 'email' : findFieldOfMessage(error.message)
      if (field) {
        setFieldErrors({ ...EMPTY_ERRORS, [field]: error.message })
      } else {
        setFormError(error.message)
      }
      setIsSubmitting(false)
    }
  }

  const passwordHint = (
    <>
      <img
        src={checkIcon}
        alt=""
        className={`${styles.checkIcon} ${isPasswordLengthValid(values.password) ? styles.checked : ''}`}
      />
      8~64자
    </>
  )

  return (
    <main className={styles.page}>
      <BackButton className={styles.backButton} />

      <h1 className={styles.title}>간단히 가입할게요</h1>
      <p className={styles.description}>매칭 후보와 알림을 받으려면 계정이 필요해요.</p>

      <Button variant="kakao" icon={kakaoIcon} className={styles.kakaoButton} onClick={() => startKakaoLogin()}>
        카카오로 3초 만에 가입
      </Button>

      <div className={styles.divider}>
        <span>또는 이메일로</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <TextField
            label="이메일"
            icon={mailIcon}
            size="medium"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="minji@example.com"
            value={values.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />
          <PasswordField
            size="medium"
            name="password"
            autoComplete="new-password"
            placeholder="8자 이상 입력해주세요"
            value={values.password}
            onChange={handleChange}
            error={fieldErrors.password}
            hint={passwordHint}
          />
          <TextField
            label="닉네임"
            icon={userIcon}
            size="medium"
            name="nickname"
            autoComplete="nickname"
            placeholder="민지"
            value={values.nickname}
            onChange={handleChange}
            error={fieldErrors.nickname}
            hint="2~10자"
          />
        </div>

        <div className={styles.bottom}>
          {formError && <FormAlert>{formError}</FormAlert>}
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? '가입하는 중...' : '가입하고 시작하기'}
          </Button>
          <p className={styles.footer}>
            이미 계정이 있나요?{' '}
            <Link to="/login" replace className={styles.footerLink}>
              로그인
            </Link>
          </p>
        </div>
      </form>
    </main>
  )
}
