import { useId } from 'react'
import alertIcon from '../../assets/icons/alert-field.svg'
import styles from './TextField.module.css'

export default function TextField({
  label,
  icon,
  id,
  size = 'large',
  error,
  hint,
  trailing,
  className = '',
  ...inputProps
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const hasMessage = Boolean(error || hint)

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.inputBox} ${styles[size]} ${error ? styles.invalid : ''}`}>
        {icon && <img src={icon} alt="" className={styles.icon} />}
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          {...inputProps}
        />
        {trailing}
      </div>
      {error ? (
        <p id={messageId} className={styles.error}>
          <img src={alertIcon} alt="" className={styles.messageIcon} />
          {error}
        </p>
      ) : (
        hint && (
          <div id={messageId} className={styles.hint}>
            {hint}
          </div>
        )
      )}
    </div>
  )
}
