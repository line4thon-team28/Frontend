import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import PetPhoto from '../PetPhoto/PetPhoto'
import PetStatusBadge from '../PetStatusBadge/PetStatusBadge'
import layout from '../../layouts/PetPageLayout.module.css'
import { candidatesPath, editRegistrationPath } from '../../routes/petPaths'
import { formatPetDate, formatPetDescription } from '../../utils/formatPetInfo'
import styles from './MyRegistrations.module.css'

export default function RegistrationCard({ pet, onFound, busy }) {
  const found = pet.status === 'found'
  const editPath = editRegistrationPath(pet.id)
  const lostDate = formatPetDate(pet.lostDate)
  const foundDate = formatPetDate(pet.foundDate)
  const cardMeta = found
    ? [foundDate && `${foundDate} 재회`, '매칭·알림 중단']
    : [pet.district || pet.city, lostDate && `${lostDate} 실종`, `${pet.photoCount}장`]
  const summary = (
    <>
      <PetPhoto photo={pet.photo} className={styles.photo} />
      <div>
        <div className={styles.nameRow}>
          <h2>{pet.name}</h2>
          <PetStatusBadge found={found} />
        </div>
        <p className={styles.petDescription}>{formatPetDescription(pet)}</p>
        <p className={styles.cardMeta}>{cardMeta.filter(Boolean).join(' · ')}</p>
        {!found && (
          <p className={styles.cardMeta}>
            <strong className={styles.candidateCount}>후보 {pet.matchCount ?? 0}건</strong>
          </p>
        )}
      </div>
    </>
  )

  if (found) {
    return (
      <article className={`${layout.card} ${styles.card} ${styles.foundCard}`}>
        <div className={`${layout.cardSummary} ${styles.cardSummary}`}>{summary}</div>
      </article>
    )
  }

  return (
    <article className={`${layout.card} ${styles.card}`}>
      <Link className={`${layout.cardSummary} ${styles.cardSummary}`} to={editPath} aria-label={`${pet.name} 등록 정보 수정`}>
        {summary}
      </Link>
      <div className={`${layout.cardActions} ${styles.cardActions}`}>
        <Link className={`${layout.actionLink} ${layout.outlineLink}`} to={candidatesPath(pet.id)}>
          후보 보기
        </Link>
        <Button size="medium" className={styles.cardButton} disabled={busy} onClick={() => onFound(pet.id)}>찾았어요</Button>
      </div>
      <p className={styles.editHint}>
        <Link to={editPath}>특징·연락처만 수정할 수 있어요</Link>
      </p>
    </article>
  )
}
