import styles from './SelectBox.module.css'

export default function SelectBox({ options, placeholder, invalid, className = '', value, ...selectProps }) {
  return (
    <div className={`${styles.box} ${invalid ? styles.invalid : ''} ${value ? '' : styles.empty} ${className}`}>
      <select className={styles.select} value={value} aria-invalid={invalid ? true : undefined} {...selectProps}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.arrow} aria-hidden="true">
        ⌄
      </span>
    </div>
  )
}
