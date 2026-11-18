import { Link } from 'react-router-dom'
import { formatMonthDay, formatSimilarity } from '../../utils/format'
import styles from './CandidateCard.module.css'

const SOON_DEADLINE_DAYS = 7

function getDetailPath({ type, noticeId, sightingId }) {
  return type === 'NOTICE' ? `/notices/${noticeId}` : `/sightings/${sightingId}`
}

function getTitle({ type, shelterName, place }) {
  if (type === 'NOTICE') return shelterName
  const area = place?.split(' ').at(-1)
  return area ? `목격 제보 · ${area}` : '목격 제보'
}

function DeadlineText({ candidate }) {
  if (candidate.type === 'SIGHTING') {
    return <p className={`${styles.deadline} ${styles.muted}`}>제보자 익명</p>
  }
  if (candidate.daysLeft === null) return null

  if (candidate.urgent) {
    return <p className={`${styles.deadline} ${styles.urgent}`}>마감까지 {candidate.daysLeft}일 · 긴급</p>
  }
  const toneClass = candidate.daysLeft <= SOON_DEADLINE_DAYS ? styles.soon : styles.muted
  return <p className={`${styles.deadline} ${toneClass}`}>마감까지 {candidate.daysLeft}일</p>
}

export default function CandidateCard({ candidate, pinned, dimmed, onFeedback, onFound }) {
  const detailPath = getDetailPath(candidate)
  const title = getTitle(candidate)
  const happenedLabel = candidate.type === 'NOTICE' ? '발견' : '목격'

  return (
    <article className={`${styles.card} ${pinned ? styles.pinned : ''} ${dimmed ? styles.dimmed : ''}`}>
      <Link to={detailPath} className={styles.summary} aria-label={`${title} 후보 상세 보기`}>
        <img src={candidate.imageUrl} alt="" className={styles.photo} />
        <div className={styles.info}>
          <div className={styles.scoreRow}>
            <p className={styles.score}>
              <strong>{formatSimilarity(candidate.similarity)}</strong>
              <span>유사도</span>
            </p>
            <span className={`${styles.typeTag} ${candidate.type === 'SIGHTING' ? styles.sightingTag : ''}`}>
              {candidate.type === 'NOTICE' ? '보호소 공고' : '목격'}
            </span>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.meta}>
            {candidate.place} · {formatMonthDay(candidate.occurredOn)} {happenedLabel}
          </p>
          <DeadlineText candidate={candidate} />
        </div>
      </Link>

      <div className={styles.actions}>
        {pinned ? (
          <>
            <Link to={detailPath} className={`${styles.action} ${styles.outlineAction}`}>
              {candidate.type === 'NOTICE' ? '공고 상세 보기' : '목격 상세 보기'}
            </Link>
            <button type="button" className={`${styles.action} ${styles.darkAction}`} onClick={onFound}>
              찾았어요로 완료
            </button>
          </>
        ) : (
          <>
            <button type="button" className={`${styles.action} ${styles.outlineAction}`} onClick={() => onFeedback('no')}>
              아니에요
            </button>
            <button type="button" className={`${styles.action} ${styles.yesAction}`} onClick={() => onFeedback('yes')}>
              맞아요
            </button>
          </>
        )}
      </div>
    </article>
  )
}
