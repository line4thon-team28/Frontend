import { useState } from 'react'
import eyeIcon from '../../assets/icons/eye.svg'
import lockIcon from '../../assets/icons/lock.svg'
import TextField from '../TextField/TextField'
import styles from './PasswordField.module.css'

export default function PasswordField({ label = '비밀번호', ...props }) {
  const [isVisible, setIsVisible] = useState(false)

  const toggleButton = (
    <button
      type="button"
      className={`${styles.toggle} ${isVisible ? styles.active : ''}`}
      onClick={() => setIsVisible((visible) => !visible)}
      aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
      aria-pressed={isVisible}
    >
      <img src={eyeIcon} alt="" />
    </button>
  )

  return (
    <TextField
      label={label}
      icon={lockIcon}
      type={isVisible ? 'text' : 'password'}
      trailing={toggleButton}
      {...props}
    />
  )
}
