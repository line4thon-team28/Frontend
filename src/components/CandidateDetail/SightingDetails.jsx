import Button from '../Button/Button'
import layout from '../../layouts/PetPageLayout.module.css'
import styles from './CandidateDetail.module.css'

export default function SightingDetails({ candidate, onFeedback, feedbackEnabled }) {
  const location = candidate.location?.trim()
  const reportedAt = candidate.reportedAt

  return (
    <>
      <section className={`${styles.content} ${styles.sightingContent}`} aria-label="목격 결과 상세">
        <h1 className={styles.title}>비슷한 아이가 목격됐어요</h1>
        {(reportedAt || location) && (
          <dl className={`${styles.facts} ${styles.sightingFacts}`}>
            {reportedAt && <div><dt>목격 날짜</dt><dd>{reportedAt}</dd></div>}
            {location && <div><dt>목격 장소</dt><dd>{location}</dd></div>}
          </dl>
        )}
        {candidate.note && (
          <section className={styles.note}>
            <h2>제보자 메모</h2>
            <p>“{candidate.note}”</p>
          </section>
        )}
      </section>
      <footer className={`${layout.stickyFooter} ${styles.actions} ${styles.feedbackActions}`}>
        <Button variant="outline" disabled={!feedbackEnabled} onClick={() => onFeedback('hidden')}>아니에요</Button>
        <Button variant="primary" disabled={!feedbackEnabled} onClick={() => onFeedback('match')}>비슷해요</Button>
      </footer>
    </>
  )
}
