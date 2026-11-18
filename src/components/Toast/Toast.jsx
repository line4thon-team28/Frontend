import { useEffect } from 'react'
import styles from './Toast.module.css'

const TOAST_DURATION_MS = 5000

export default function Toast({ message, actionLabel, onAction, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div className={styles.toast} role="status">
      <p className={styles.message}>{message}</p>
      {actionLabel && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
