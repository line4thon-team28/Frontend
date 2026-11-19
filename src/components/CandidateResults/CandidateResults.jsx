import PetPhoto from '../PetPhoto/PetPhoto'
import NotificationBell from '../NotificationBell/NotificationBell'
import StatusView from '../StatusView/StatusView'
import layout from '../../layouts/PetPageLayout.module.css'
import CandidateCard from './CandidateCard'
import CandidateStatus from './CandidateStatus'
import { useCandidateResults } from '../../hooks/useCandidatesPage'
import styles from './CandidateResults.module.css'

const SORT_OPTIONS = [
  { key: 'score', label: '유사도순' },
  { key: 'deadline', label: '마감임박순' },
]

export default function CandidateResults({ pet, candidates, scenario, feedback, setFeedback, markFound, previewControl }) {
  const {
    sort, setSort, phase, found, hiddenCount, latestHiddenId, visibleCandidates, pinnedCandidates,
    shownCandidates, viewingList, resultLabel, statusText, announcement, heading, undoButton, showFeedback,
    setFocusTarget, retryAnalysis, retryLoading, precise, unreadCount,
  } = useCandidateResults({ pet, candidates, scenario, feedback, setFeedback, markFound })

  function renderCards(items, pinned = false) {
    return items.map((candidate) => (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
        petId={pet.id}
        pinned={pinned}
        readOnly={found}
        precise={precise}
        setFocusTarget={setFocusTarget}
        showFeedback={showFeedback}
      />
    ))
  }

  return (
    <div className={`${layout.tabPage} ${layout.padded} ${styles.page}`}>
      <header className={styles.header}>
        <PetPhoto className={styles.petPhoto} photo={pet?.photo} />
        <div className={styles.heading}>
          <h1 ref={heading} tabIndex={-1}>{pet?.name ? `${pet.name}의 후보` : '후보'}</h1>
          {statusText && <p>{statusText}</p>}
        </div>
        <NotificationBell unreadCount={unreadCount} />
      </header>

      <div className={styles.toolbar}>
        <div className={styles.toolbarActions}>
          <div className={styles.sortOptions} role="group" aria-label="후보 정렬">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={sort === option.key}
                disabled={!viewingList && phase !== 'loading'}
                className={`${styles.sortButton} ${sort === option.key ? styles.selectedSort : ''}`}
                onClick={() => setSort(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {previewControl}
        </div>
        <p className={styles.resultLabel}>{resultLabel}</p>
      </div>

      <div className={styles.announcement} role="status">{announcement}</div>

      <CandidateStatus phase={phase} pet={pet} found={found} retryAnalysis={retryAnalysis} retryLoading={retryLoading} />

      {viewingList && !found && pinnedCandidates.length > 0 && (
        <section className={styles.stack} aria-label="비슷해요로 표시한 후보">
          <p className={styles.pinnedLabel}><span aria-hidden="true">✓</span> 비슷해요로 표시한 후보 · 맨 위 고정</p>
          <ul className={styles.stack}>{renderCards(pinnedCandidates, true)}</ul>
        </section>
      )}

      {viewingList && shownCandidates.length > 0 && (
        <section className={styles.stack} aria-label="후보 목록">
          {!found && pinnedCandidates.length > 0 && <p className={styles.otherLabel}>다른 후보</p>}
          <ul className={styles.stack}>{renderCards(shownCandidates)}</ul>
        </section>
      )}

      {viewingList && !found && visibleCandidates.length === 0 && (
        <div className={`${layout.centeredState} ${styles.centered}`}>
          <StatusView title="표시할 후보가 없어요" description="새로운 후보가 생기면 이곳에서 확인할 수 있어요." />
        </div>
      )}

      {viewingList && !found && latestHiddenId && (
        <div className={styles.toast}>
          <p>후보 {hiddenCount}건을 숨겼어요</p>
          <button type="button" ref={undoButton} onClick={() => showFeedback(latestHiddenId, null)}>되돌리기</button>
        </div>
      )}
    </div>
  )
}
