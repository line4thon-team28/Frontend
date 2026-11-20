import { useNavigate } from 'react-router-dom'
import chevronLeftIcon from '../../assets/icons/chevron-left.svg'
import chevronLeftWhiteIcon from '../../assets/icons/chevron-left-white.svg'
import styles from './BackButton.module.css'

export default function BackButton({ variant = 'default', fallbackPath = '/start', onClick, className = '' }) {
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }
    navigate(fallbackPath, { replace: true })
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick ?? goBack}
      aria-label="뒤로 가기"
    >
      <img src={variant === 'overlay' ? chevronLeftWhiteIcon : chevronLeftIcon} alt="" />
    </button>
  )
}
