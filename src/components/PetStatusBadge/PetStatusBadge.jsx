import styles from './PetStatusBadge.module.css'

export default function PetStatusBadge({ found }) {
  return <span className={`${styles.badge} ${found ? styles.badgeFound : ''}`}>{found ? '찾음' : '찾는 중'}</span>
}
