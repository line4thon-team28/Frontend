import { DayPicker } from '@daypicker/react'
import { ko } from '@daypicker/react/locale/ko'
import '@daypicker/react/style.css'
import useModalDialog from '../../hooks/useModalDialog'
import dialogStyles from '../../layouts/DialogLayout.module.css'
import { formatPetDate } from '../../utils/formatPetInfo'
import styles from './LostRegistrationForm.module.css'

function toDateValue(date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function LostDatePicker({ id, value, onChange, invalid }) {
  const { dialogRef, isOpen, open, close, handleClose } = useModalDialog()
  const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined
  const today = new Date()
  const dialogId = `${id}-dialog`

  function selectDate(date) {
    if (!date) return
    onChange(toDateValue(date))
    close()
  }

  return (
    <>
      <button
        id={id}
        type="button"
        className={`${styles.control} ${styles.dateTrigger}`}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onClick={open}
      >
        <span id={`${id}-value`} className={value ? undefined : styles.datePlaceholder}>
          {formatPetDate(value) || '날짜 선택'}
        </span>
        <span className={styles.calendarIcon} aria-hidden="true" />
      </button>
      <dialog
        id={dialogId}
        ref={dialogRef}
        className={`${dialogStyles.dialog} ${styles.dateDialog}`}
        aria-labelledby={`${dialogId}-title`}
        onClose={handleClose}
      >
        <div className={styles.dateDialogHeader}>
          <h2 id={`${dialogId}-title`}>실종 날짜 선택</h2>
          <button type="button" onClick={close}>닫기</button>
        </div>
        {isOpen && (
          <DayPicker
            className={styles.calendar}
            locale={ko}
            mode="single"
            required
            autoFocus
            selected={selectedDate}
            defaultMonth={selectedDate ?? today}
            today={today}
            endMonth={today}
            disabled={{ after: today }}
            onSelect={selectDate}
          />
        )}
      </dialog>
    </>
  )
}
