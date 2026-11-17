import { useId } from 'react'
import styles from './TextField.module.css'

export default function TextField({ label, icon, id, className = '', ...inputProps }) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputBox}>
        {icon && <img src={icon} alt="" className={styles.icon} />}
        <input id={inputId} className={styles.input} {...inputProps} />
      </div>
    </div>
  )
}
