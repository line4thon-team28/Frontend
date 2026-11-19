import { Link } from 'react-router-dom'
import { petPaths } from '../../routes/petPaths'
import PetPhoto from '../PetPhoto/PetPhoto'
import NotificationBell from '../NotificationBell/NotificationBell'
import StatusView from '../StatusView/StatusView'
import layout from '../../layouts/PetPageLayout.module.css'
import CandidateCard from './CandidateCard'
import CandidateStatus from './CandidateStatus'
import styles from './CandidateResults.module.css'

const SORT_OPTIONS = [
  { key: 'score', label: '유사도순' },
  { key: 'deadline', label: '마감임박순' },
]

export default function CandidateResults({ pet, model }) {
  const {
    sort, setSort, phase, found, hiddenCount, latestHiddenId, visibleCandidates, pinnedCandidates,
    shownCandidates, viewingList, resultLabel, statusText, announcement, heading, undoButton, showFeedback,
    setFocusTarget, retryAnalysis, retryLoading, precise, unreadCount, processingMessage, actionError, busy,
  } = model

  function renderCards(items, pinned = false) {
    return items.map((candidate) => (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
        petId={pet.id}
        pinned={pinned}
        readOnly={found || busy}
        precise={precise}
        setFocusTarget={setFocusTarget}
        showFeedback={showFeedback}
      />
    ))
  }

  return (
    <div className={`${layout.tabPage} ${layout.padded} ${styles.page}`}>
      <header className={styles.header}>
        {pet ? (
          <Link to={petPaths.registrations} className={styles.petPhotoLink} aria-label="내 등록으로 이동">
            <PetPhoto className={styles.petPhoto} photo={pet.photo} />
          </Link>
        ) : <PetPhoto className={styles.petPhoto} />}
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
        </div>
        <p className={styles.resultLabel}>{resultLabel}</p>
      </div>

      <div className={styles.announcement} role="status">{announcement}</div>

      {actionError && <p role="alert">{actionError}</p>}
      <CandidateStatus processingMessage={processingMessage} busy={busy} phase={phase} pet={pet} found={found} retryAnalysis={retryAnalysis} retryLoading={retryLoading} />

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

      {phase === 'ready' && !found && visibleCandidates.length === 0 && (
        <div className={`${layout.centeredState} ${styles.centered}`}>
          <StatusView title="표시할 후보가 없어요" description="새로운 후보가 생기면 이곳에서 확인할 수 있어요." />
        </div>
      )}

      {viewingList && !found && latestHiddenId && (
        <div className={styles.toast}>
          <p>후보 {hiddenCount}건을 숨겼어요</p>
          <button type="button" ref={undoButton} disabled={busy} onClick={() => showFeedback(latestHiddenId, null)}>되돌리기</button>
        </div>
      )}
    </div>
  )
}
