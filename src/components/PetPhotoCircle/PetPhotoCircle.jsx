import pawIcon from '../../assets/icons/paw.svg'
import styles from './PetPhotoCircle.module.css'

export default function PetPhotoCircle({ src, alt = '', className = '' }) {
  return (
    <div className={`${styles.circle} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className={styles.photo} />
      ) : (
        <div className={styles.placeholder}>
          <img src={pawIcon} alt="" className={styles.placeholderIcon} />
        </div>
      )}
    </div>
  )
}
