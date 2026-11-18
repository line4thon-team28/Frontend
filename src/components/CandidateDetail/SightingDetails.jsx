import Button from '../Button/Button'
import layout from '../../layouts/PetPageLayout.module.css'
import styles from './CandidateDetail.module.css'

export default function SightingDetails({ candidate, onFeedback, feedbackEnabled }) {
  const locationName = candidate.location?.trim().split(/\s+/).at(-1)
  const title = locationName ? `비슷한 아이가 ${locationName}에서 목격됐어요` : '비슷한 아이가 목격됐어요'

  return (
    <>
      <section className={`${styles.content} ${styles.sightingContent}`} aria-label="목격 결과 상세">
        <h1 className={styles.sightingTitle}>{title}</h1>
        <p className={styles.meta}>{[candidate.reportedAt, candidate.location].filter(Boolean).join(' · ')}</p>
        {candidate.note && (
          <section className={styles.note}>
            <h2>제보자 메모</h2>
            <p>“{candidate.note}”</p>
          </section>
        )}
        <p className={styles.privacy}>제보자는 익명이에요. 연락처는 교환되지 않아요.</p>
      </section>
      <footer className={`${layout.stickyFooter} ${styles.actions} ${styles.feedbackActions}`}>
        <Button variant="outline" disabled={!feedbackEnabled} onClick={() => onFeedback('hidden')}>아니에요</Button>
        <Button variant="primary" disabled={!feedbackEnabled} onClick={() => onFeedback('match')}>비슷해요</Button>
      </footer>
    </>
  )
}
