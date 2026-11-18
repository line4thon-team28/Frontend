import styles from './PetFeaturesField.module.css'

const MAX_FEATURES = 200

export default function PetFeaturesField({ id, value, onChange, variant = 'new' }) {
  const lengthId = `${id}-length`

  return (
    <div className={`${styles.field} ${variant === 'edit' ? styles.edit : ''}`}>
      <div className={styles.labelRow}>
        <label htmlFor={id}>특징</label>
        <span id={lengthId}>{value.length} / {MAX_FEATURES}</span>
      </div>
      <textarea
        id={id}
        name="features"
        aria-describedby={lengthId}
        maxLength={MAX_FEATURES}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
