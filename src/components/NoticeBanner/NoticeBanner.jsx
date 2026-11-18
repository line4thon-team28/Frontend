import styles from './NoticeBanner.module.css'

export default function NoticeBanner({ tone = 'warning', title, children }) {
  return (
    <div className={`${styles.banner} ${styles[tone]}`} role="status">
      <span className={styles.mark} aria-hidden="true">
        !
      </span>
      <div className={styles.text}>
        {title && <p className={styles.title}>{title}</p>}
        <p className={title ? styles.description : styles.title}>{children}</p>
      </div>
    </div>
  )
}
