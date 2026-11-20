import alertIcon from '../../assets/icons/alert-box.svg'
import styles from './FormAlert.module.css'

export default function FormAlert({ children, className = '' }) {
  return (
    <p className={`${styles.alert} ${className}`} role="alert">
      <img src={alertIcon} alt="" className={styles.icon} />
      {children}
    </p>
  )
}
