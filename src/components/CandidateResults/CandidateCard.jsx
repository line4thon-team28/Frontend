import { Link } from 'react-router-dom'
import PetPhoto from '../PetPhoto/PetPhoto'
import Button from '../Button/Button'
import layout from '../../layouts/PetPageLayout.module.css'
import { candidateDetailPath } from '../../routes/petPaths'
import styles from './CandidateResults.module.css'

function candidateDeadline(candidate) {
  return !candidate.closed && Number.isFinite(candidate.deadlineDays) && candidate.deadlineDays >= 0
    ? candidate.deadlineDays
    : Number.POSITIVE_INFINITY
}

export default function CandidateCard({ candidate, petId, pinned, readOnly, precise, setFocusTarget, showFeedback }) {
  const isSighting = candidate.type === 'sighting'
  const detailUrl = candidateDetailPath(candidate.id, petId)
  const deadline = candidateDeadline(candidate)
  const urgent = candidate.urgent ?? deadline <= 2

  return (
    <li className={`${layout.card} ${styles.card} ${pinned ? styles.pinned : ''} ${readOnly ? styles.readOnly : ''}`}>
      <article>
        <Link
          className={`${layout.cardSummary} ${styles.cardSummary}`}
          to={detailUrl}
          state={{ candidate, petId }}
          aria-label={`${candidate.title} 상세 보기`}
          ref={setFocusTarget ? (element) => { setFocusTarget(candidate.id, element) } : undefined}
        >
          <PetPhoto className={styles.candidatePhoto} photo={candidate.photo} />
          <div className={styles.cardDetails}>
            <div className={styles.scoreRow}>
              <span className={styles.score}>{precise ? candidate.score : Math.trunc(candidate.score)}%</span>
              <span className={styles.scoreLabel}>유사도</span>
              <span className={`${styles.category} ${isSighting ? styles.sighting : ''}`}>
                {isSighting ? '목격' : '보호소 공고'}
              </span>
            </div>
            <h2 className={styles.candidateTitle}>{candidate.title}</h2>
            <p className={styles.candidateMeta}>{[candidate.location, candidate.reportedAt].filter(Boolean).join(' · ')}</p>
            {isSighting ? (
              <p className={styles.candidateMeta}>제보자 익명</p>
            ) : (
              <p className={`${styles.deadline} ${urgent ? styles.urgent : ''}`}>
                {Number.isFinite(deadline) ? `마감까지 ${deadline}일${urgent ? ' · 긴급' : ''}` : candidate.closed ? '공고 종료' : '마감일 정보 없음'}
              </p>
            )}
          </div>
        </Link>

        {pinned ? (
          <div className={`${layout.cardActions} ${styles.cardActions}`}>
            <Link className={styles.secondaryAction} to={detailUrl} state={{ candidate, petId }}>{isSighting ? '제보 상세 보기' : '공고 상세 보기'}</Link>
            <Button variant="dark" size="compact" disabled={readOnly} onClick={() => showFeedback(candidate.id, 'found')}>
              찾았어요
            </Button>
          </div>
        ) : (
          <div className={`${layout.cardActions} ${styles.cardActions}`}>
            <Button variant="outline" size="compact" disabled={readOnly} onClick={() => showFeedback(candidate.id, 'hidden')}>
              아니에요
            </Button>
            <Button variant="soft" size="compact" disabled={readOnly} onClick={() => showFeedback(candidate.id, 'match')}>
              비슷해요
            </Button>
          </div>
        )}
      </article>
    </li>
  )
}
