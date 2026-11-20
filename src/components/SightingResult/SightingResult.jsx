import { useEffect, useState } from 'react'
import { fetchSightingResult } from '../../apis/sightings'
import { formatDayAndClock } from '../../utils/dateTime'
import Button from '../Button/Button'
import styles from './SightingResult.module.css'

const WAITING_STATUSES = ['NOT_REQUESTED', 'PENDING', 'PROCESSING']
const COMPARED_STATUSES = ['READY', 'PARTIAL']
const DEFAULT_RETRY_SECONDS = 10
const MAX_POLLS = 18

function ResultMessage({ result, isWaiting, stoppedWaiting }) {
  if (result.matchedCount > 0) {
    return (
      <div className={styles.card}>
        <p className={styles.cardTitle}>주인에게 알렸어요</p>
        <p className={styles.cardText}>비슷한 실종 등록이 있어 보호자에게 알림을 보냈어요.</p>
      </div>
    )
  }
  if (stoppedWaiting) {
    return <p className={styles.note}>비교가 끝나면 비슷한 실종 등록의 보호자에게 알려드려요.</p>
  }
  if (isWaiting) {
    return (
      <div className={styles.card}>
        <p className={`${styles.cardTitle} ${styles.waiting}`}>
          <span className={styles.pulse} aria-hidden="true" />
          비교하고 있어요
        </p>
        <p className={styles.cardText}>{result.processingMessage}</p>
      </div>
    )
  }
  if (result.processingStatus === 'READY') {
    return <p className={styles.note}>아직 비슷한 실종 등록이 없어요. 비슷한 등록이 생기면 자동으로 비교해요.</p>
  }
  return <p className={styles.note}>{result.processingMessage}</p>
}

export default function SightingResult({ initialResult, photoUrl, placeLabel, seenAt, onReportAgain, onGoHome }) {
  const [poll, setPoll] = useState({ result: initialResult, count: 0, failed: false })
  const { result } = poll
  const isWaiting = WAITING_STATUSES.includes(result.processingStatus)
  const stoppedWaiting = isWaiting && (poll.failed || poll.count >= MAX_POLLS)

  useEffect(() => {
    if (!isWaiting || stoppedWaiting) return undefined

    let ignore = false
    const delay = (result.retryAfterSeconds ?? DEFAULT_RETRY_SECONDS) * 1000
    const timer = setTimeout(() => {
      fetchSightingResult(result.sightingId)
        .then((next) => !ignore && setPoll((prev) => ({ ...prev, result: next, count: prev.count + 1 })))
        .catch(() => !ignore && setPoll((prev) => ({ ...prev, failed: true })))
    }, delay)
    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [result, isWaiting, stoppedWaiting])

  const renderProgress = () => {
    if (isWaiting && !stoppedWaiting) return '등록된 실종 동물과 비교하고 있어요.'
    if (COMPARED_STATUSES.includes(result.processingStatus)) return '등록된 실종 동물과 바로 비교했어요.'
    return null
  }
  const progress = renderProgress()

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.photoRing}>
          <img src={photoUrl} alt="제보한 사진" className={styles.photo} />
          <span className={styles.check} aria-hidden="true">
            ✓
          </span>
        </div>
        <h1 className={styles.title}>제보가 접수됐어요</h1>
        <p className={styles.summary}>
          {placeLabel} · {formatDayAndClock(seenAt)}
          {progress && (
            <>
              <br />
              {progress}
            </>
          )}
        </p>
        <div className={styles.result} aria-live="polite">
          <ResultMessage result={result} isWaiting={isWaiting} stoppedWaiting={stoppedWaiting} />
        </div>
        <p className={styles.privacy}>제보자의 IP·쿠키는 저장하지 않아요</p>
      </div>
      <div className={styles.actions}>
        <Button variant="dark" onClick={onReportAgain}>
          한 번 더 제보하기
        </Button>
        <button type="button" className={styles.homeButton} onClick={onGoHome}>
          홈으로
        </button>
      </div>
    </main>
  )
}
