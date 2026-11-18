import styles from './PetCardSkeleton.module.css'

export default function PetCardSkeleton({ variant = 'candidate', className }) {
  return (
    <div className={[className, styles.root, styles[variant]].filter(Boolean).join(' ')} aria-hidden="true">
      <div className={styles.summary}>
        <span className={styles.photo} />
        <div className={styles.lines}><span /><span /><span /><span /></div>
      </div>
      <div className={styles.actions}><span /><span /></div>
    </div>
  )
}
