import styles from './StatusView.module.css'

export default function StatusView({ icon, tone = 'neutral', title, description, action }) {
  return (
    <section className={styles.statusView} role={tone === 'error' ? 'alert' : 'status'}>
      {icon && (
        <div className={`${styles.iconCircle} ${styles[tone]}`}>
          <img src={icon} alt="" className={styles.icon} />
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </section>
  )
}
