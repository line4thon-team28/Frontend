import PetPhoto from '../PetPhoto/PetPhoto'
import BackButton from '../BackButton/BackButton'
import PhotoViewer from '../PhotoViewer/PhotoViewer'
import styles from './CandidateDetail.module.css'

export default function DetailHeader({ candidate, pet, backTo, isSighting, closed }) {
  const photoLabel = isSighting ? '목격 제보 사진' : '보호소 공고 사진'

  return (
    <header className={`${styles.hero} ${isSighting ? styles.sightingHero : ''}`}>
      {candidate.photo && <PhotoViewer key={candidate.id} photo={candidate.photo} label={photoLabel} className={styles.heroPhotoButton} imageClassName={`${styles.heroPhoto} ${closed ? styles.closedPhoto : ''}`} />}
      <BackButton className={styles.back} fallbackPath={backTo} />
      {isSighting && <span className={styles.sightingBadge}>목격 제보</span>}
      {closed && <p className={styles.closedOverlay}>이 공고는 종료되었어요(반환)</p>}
      {pet && (
        <div className={styles.comparison}>
          <PetPhoto photo={pet.photo} />
          <div>
            <p>내가 등록한 {pet.name}</p>
            <strong>유사도 {Math.round(candidate.score)}%</strong>
          </div>
        </div>
      )}
    </header>
  )
}
