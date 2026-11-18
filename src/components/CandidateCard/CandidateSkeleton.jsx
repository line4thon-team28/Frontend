import styles from './CandidateSkeleton.module.css'

export default function CandidateSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.summary}>
        <span className={`${styles.block} ${styles.photo}`} />
        <div className={styles.lines}>
          <span className={`${styles.block} ${styles.short}`} />
          <span className={`${styles.block} ${styles.long}`} />
          <span className={`${styles.block} ${styles.medium}`} />
          <span className={`${styles.block} ${styles.tiny}`} />
        </div>
      </div>
      <div className={styles.actions}>
        <span className={`${styles.block} ${styles.button}`} />
        <span className={`${styles.block} ${styles.button}`} />
      </div>
    </div>
  )
}
