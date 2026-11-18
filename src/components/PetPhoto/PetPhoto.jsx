import pawIcon from '../../assets/icons/paw.svg'
import styles from './PetPhoto.module.css'

export default function PetPhoto({ photo, className = '', alt = '' }) {
  return <img className={`${styles.photo} ${className}`} src={photo || pawIcon} alt={alt} />
}
