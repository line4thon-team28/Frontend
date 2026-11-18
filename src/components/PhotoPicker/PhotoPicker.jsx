import { useId } from 'react'
import FieldError from '../FieldError/FieldError'
import styles from './PhotoPicker.module.css'

const VISIBLE_SLOTS = 4
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/heic,image/heif'

export default function PhotoPicker({ label, required, photos, max = 5, error, isProcessing, onSelectFiles, onRemove }) {
  const inputId = useId()
  const errorId = `${inputId}-error`
  const canAdd = photos.length < max && !isProcessing
  const emptySlotCount = Math.max(0, VISIBLE_SLOTS - 1 - photos.length)

  const handleChange = (event) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length > 0) onSelectFiles(files)
  }

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <span className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </span>
        <span className={styles.counter}>
          {photos.length} / {max} · 첫 장이 대표
        </span>
      </div>

      <ul className={styles.slots}>
        {canAdd && (
          <li>
            <label htmlFor={inputId} className={`${styles.slot} ${styles.addSlot} ${error ? styles.invalid : ''}`}>
              <span className={styles.plus} aria-hidden="true">
                +
              </span>
              <span className={styles.addText}>촬영·추가</span>
            </label>
            <input
              id={inputId}
              type="file"
              accept={ACCEPTED_TYPES}
              multiple
              className={styles.fileInput}
              onChange={handleChange}
              aria-label={`${label} 촬영 또는 추가`}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
            />
          </li>
        )}
        {isProcessing && (
          <li className={`${styles.slot} ${styles.processing}`} role="status">
            처리 중
          </li>
        )}
        {photos.map((photo, index) => (
          <li key={photo.id} className={`${styles.slot} ${styles.photoSlot}`}>
            <img src={photo.previewUrl} alt={`${label} ${index + 1}`} />
            {index === 0 && <span className={styles.coverBadge}>대표</span>}
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onRemove(photo.id)}
              aria-label={`${label} ${index + 1} 삭제`}
            >
              ×
            </button>
          </li>
        ))}
        {Array.from({ length: emptySlotCount }, (_, index) => (
          <li key={`empty-${index}`} className={`${styles.slot} ${styles.emptySlot}`} aria-hidden="true" />
        ))}
      </ul>

      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  )
}
