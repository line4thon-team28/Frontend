import alertIcon from '../../assets/icons/alert-field.svg'
import styles from './FieldError.module.css'

export default function FieldError({ id, children }) {
  return (
    <p id={id} className={styles.error}>
      <img src={alertIcon} alt="" className={styles.icon} />
      {children}
    </p>
  )
}
