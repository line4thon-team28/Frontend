import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchLostPet } from '../../apis/lostPets'
import { fetchMatches, retryMatching, sendMatchFeedback } from '../../apis/matches'
import clockIcon from '../../assets/icons/clock.svg'
import errorIcon from '../../assets/icons/error.svg'
import pawIcon from '../../assets/icons/paw.svg'
import pinIcon from '../../assets/icons/pin.svg'
import refreshIcon from '../../assets/icons/refresh.svg'
import Button from '../../components/Button/Button'
import CandidateCard from '../../components/CandidateCard/CandidateCard'
import CandidateSkeleton from '../../components/CandidateCard/CandidateSkeleton'
import NoticeBanner from '../../components/NoticeBanner/NoticeBanner'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import StatusView from '../../components/StatusView/StatusView'
import Toast from '../../components/Toast/Toast'
import { formatMonthDay } from '../../utils/format'
import styles from './MatchesPage.module.css'

const SORT_OPTIONS = [
  { value: 'similarity', label: '유사도순' },
  { value: 'deadline', label: '마감임박순' },
]
const POLLING_STATUSES = ['PENDING', 'PROCESSING', 'NOT_REQUESTED']
const RESULT_STATUSES = ['READY', 'PARTIAL', 'CANCELLED']
const DEFAULT_RETRY_SECONDS = 10

function LostPetHeader({ lostPet }) {
  if (!lostPet) {
    return (
      <div className={styles.petHeader} aria-hidden="true">
        <span className={`${styles.petPhoto} ${styles.placeholder}`} />
        <div className={styles.petText}>
          <span className={`${styles.placeholder} ${styles.titlePlaceholder}`} />
          <span className={`${styles.placeholder} ${styles.subtitlePlaceholder}`} />
        </div>
      </div>
    )
  }

  const statusLabel = lostPet.status === 'FOUND' ? '찾음' : '찾는 중'
  const details = [lostPet.sigunguName, `${formatMonthDay(lostPet.lostDate)} 실종`, statusLabel].filter(Boolean)

  return (
    <div className={styles.petHeader}>
      <img src={lostPet.imageUrl} alt="" className={styles.petPhoto} />
      <div className={styles.petText}>
        <h1 className={styles.petTitle}>{lostPet.name ?? '우리 아이'}의 후보</h1>
        <p className={styles.petDetails}>{details.join(' · ')}</p>
      </div>
    </div>
  )
}

function AnalyzingView({ lostPet }) {
  return (
    <>
      <section className={styles.analyzingCard} role="status">
        <div className={styles.analyzingRing}>
          {lostPet && <img src={lostPet.imageUrl} alt="" />}
        </div>
        <h2 className={styles.analyzingTitle}>사진 분석 중이에요</h2>
        <p className={styles.analyzingText}>10초마다 자동으로 새로고침돼요.</p>
      </section>
      <div className={styles.fadedSkeleton}>
        <CandidateSkeleton />
      </div>
    </>
  )
}

export default function MatchesPage() {
  const { lostPetId } = useParams()
  const navigate = useNavigate()
  const [sort, setSort] = useState('similarity')
  const [reloadToken, setReloadToken] = useState(0)
  const requestKey = `${lostPetId}|${sort}|${reloadToken}`

  const [result, setResult] = useState(null)
  const [lostPetResult, setLostPetResult] = useState(null)
  const [feedbackOverrides, setFeedbackOverrides] = useState({})
  const [hiddenCount, setHiddenCount] = useState(0)
  const [toast, setToast] = useState(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const toastId = useRef(0)

  useEffect(() => {
    let ignore = false
    fetchLostPet(lostPetId)
      .then((lostPet) => !ignore && setLostPetResult({ lostPetId, lostPet }))
      .catch(() => !ignore && setLostPetResult({ lostPetId, lostPet: null }))
    return () => {
      ignore = true
    }
  }, [lostPetId])

  useEffect(() => {
    let ignore = false
    fetchMatches(lostPetId, { sort })
      .then((data) => !ignore && setResult({ key: requestKey, data }))
      .catch((error) => !ignore && setResult({ key: requestKey, error }))
    return () => {
      ignore = true
    }
  }, [lostPetId, sort, requestKey])

  useEffect(() => {
    if (!result?.data || !POLLING_STATUSES.includes(result.data.processingStatus)) return

    let ignore = false
    const delay = (result.data.retryAfterSeconds ?? DEFAULT_RETRY_SECONDS) * 1000
    const timer = setTimeout(() => {
      fetchMatches(lostPetId, { sort })
        .then((data) => !ignore && setResult({ key: result.key, data }))
        .catch((error) => !ignore && setResult({ key: result.key, error }))
    }, delay)
    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [result, lostPetId, sort])

  const closeToast = useCallback(() => setToast(null), [])

  const lostPet = lostPetResult?.lostPetId === lostPetId ? lostPetResult.lostPet : null
  const isLoading = result?.key !== requestKey
  const error = isLoading ? null : result.error
  const data = isLoading ? null : result.data
  const status = data?.processingStatus
  const hasResult = RESULT_STATUSES.includes(status)

  const candidates = (data?.items ?? []).map((item) => ({
    ...item,
    feedback: feedbackOverrides[item.matchId] ?? item.feedback,
  }))
  const pinnedCandidates = candidates.filter((item) => item.feedback === 'YES')
  const otherCandidates = candidates.filter((item) => item.feedback !== 'YES' && item.feedback !== 'NO')
  const visibleCount = pinnedCandidates.length + otherCandidates.length

  const applyFeedback = async (candidate, nextFeedback) => {
    setFeedbackOverrides((prev) => ({ ...prev, [candidate.matchId]: nextFeedback.toUpperCase() }))
    try {
      await sendMatchFeedback(candidate.matchId, nextFeedback)
      return true
    } catch (feedbackError) {
      setFeedbackOverrides((prev) => ({ ...prev, [candidate.matchId]: candidate.feedback }))
      setToast({ id: ++toastId.current, message: feedbackError.message })
      return false
    }
  }

  const handleUndo = async (candidate) => {
    setToast(null)
    setHiddenCount((count) => count - 1)
    const isApplied = await applyFeedback({ ...candidate, feedback: 'NO' }, 'none')
    if (!isApplied) {
      setHiddenCount((count) => count + 1)
      return
    }
    if (!data?.items.some((item) => item.matchId === candidate.matchId)) {
      setReloadToken((token) => token + 1)
    }
  }

  const handleFeedback = async (candidate, nextFeedback) => {
    if (nextFeedback !== 'no') {
      applyFeedback(candidate, nextFeedback)
      return
    }
    setHiddenCount((count) => count + 1)
    setToast({
      id: ++toastId.current,
      message: '후보 1건을 숨겼어요',
      actionLabel: '되돌리기',
      onAction: () => handleUndo(candidate),
    })
    const isApplied = await applyFeedback(candidate, 'no')
    if (!isApplied) setHiddenCount((count) => count - 1)
  }

  const handleRetryMatching = () => {
    setIsRetrying(true)
    retryMatching(lostPetId)
      .then(() => setReloadToken((token) => token + 1))
      .catch((retryError) => setToast({ id: ++toastId.current, message: retryError.message }))
      .finally(() => setIsRetrying(false))
  }

  const reload = () => setReloadToken((token) => token + 1)

  let countLabel = ''
  if (isLoading) countLabel = '불러오는 중'
  else if (status === 'PENDING' || status === 'PROCESSING') countLabel = '분석 중'
  else if (!error) {
    const suffix = hiddenCount > 0 ? ` · 숨김 ${hiddenCount}` : ' · 60% 이상'
    countLabel = `후보 ${visibleCount}건${visibleCount > 0 ? suffix : ''}`
  }
  const isSortDisabled = !isLoading && !hasResult

  const renderCandidate = (candidate, pinned) => (
    <li key={candidate.matchId}>
      <CandidateCard
        candidate={candidate}
        pinned={pinned}
        dimmed={status === 'CANCELLED'}
        onFeedback={(nextFeedback) => handleFeedback(candidate, nextFeedback)}
        onFound={() => navigate('/my')}
      />
    </li>
  )

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className={styles.list} aria-busy="true" aria-label="후보를 불러오는 중">
          <CandidateSkeleton />
          <CandidateSkeleton />
          <CandidateSkeleton />
        </div>
      )
    }

    if (error) {
      const isNotFound = error.code === 'LOST_PET_NOT_FOUND'
      return (
        <div className={styles.centered}>
          <StatusView
            icon={errorIcon}
            tone="error"
            title={isNotFound ? error.message : '후보를 불러오지 못했어요'}
            description={isNotFound ? '내 등록에서 다시 확인해 주세요.' : error.message}
            action={
              isNotFound ? (
                <Button variant="dark" size="medium" onClick={() => navigate('/my')}>
                  내 등록으로
                </Button>
              ) : (
                <Button variant="dark" size="medium" icon={refreshIcon} onClick={reload}>
                  다시 시도
                </Button>
              )
            }
          />
        </div>
      )
    }

    if (status === 'PENDING' || status === 'PROCESSING') {
      return <AnalyzingView lostPet={lostPet} />
    }

    if (status === 'NOT_REQUESTED') {
      return (
        <div className={styles.centered}>
          <StatusView
            icon={clockIcon}
            title="매칭에 필요한 등록 정보를 기다리고 있어요"
            description="등록 정보가 저장되면 바로 비교를 시작해요."
          />
        </div>
      )
    }

    if (status === 'FAILED') {
      return (
        <>
          <NoticeBanner title="등록은 저장됐어요">{data.processingMessage}</NoticeBanner>
          <div className={styles.centered}>
            <StatusView
              icon={clockIcon}
              title="사진 분석에 실패했어요"
              description="다음 주기에 자동으로 다시 비교해요. 지금 바로 다시 분석할 수도 있어요."
              action={
                <Button variant="dark" size="medium" onClick={handleRetryMatching} disabled={isRetrying}>
                  {isRetrying ? '요청하는 중...' : '다시 분석하기'}
                </Button>
              }
            />
          </div>
        </>
      )
    }

    return (
      <>
        {status === 'PARTIAL' && <NoticeBanner>{data.processingMessage}</NoticeBanner>}
        {status === 'CANCELLED' && <NoticeBanner tone="muted">{data.processingMessage}</NoticeBanner>}

        {visibleCount === 0 ? (
          <div className={styles.centered}>
            <StatusView
              icon={pawIcon}
              title="아직 비슷한 후보가 없어요"
              description={'새 보호소 공고나 목격 제보가 들어오면\n다시 비교해서 알려드릴게요.'}
            />
          </div>
        ) : (
          <>
            {pinnedCandidates.length > 0 && (
              <section className={styles.group} aria-labelledby="pinned-heading">
                <h2 id="pinned-heading" className={`${styles.groupTitle} ${styles.pinnedTitle}`}>
                  <img src={pinIcon} alt="" />
                  맞아요로 표시한 후보 · 맨 위 고정
                </h2>
                <ul className={styles.list}>{pinnedCandidates.map((candidate) => renderCandidate(candidate, true))}</ul>
              </section>
            )}
            {otherCandidates.length > 0 && (
              <section className={styles.group} aria-label="후보 목록">
                {pinnedCandidates.length > 0 && <h2 className={styles.groupTitle}>다른 후보</h2>}
                <ul className={styles.list}>{otherCandidates.map((candidate) => renderCandidate(candidate, false))}</ul>
              </section>
            )}
          </>
        )}
      </>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <LostPetHeader lostPet={lostPet} />
        <NotificationBell showBadge={lostPet?.status !== 'FOUND'} />
      </header>

      <div className={styles.toolbar}>
        <div className={styles.sortGroup} role="radiogroup" aria-label="정렬">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={sort === option.value}
              className={`${styles.sortButton} ${sort === option.value ? styles.sortSelected : ''}`}
              disabled={isSortDisabled}
              onClick={() => setSort(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={`${styles.countLabel} ${isSortDisabled ? styles.disabledText : ''}`}>{countLabel}</p>
      </div>

      <div className={styles.body}>{renderBody()}</div>

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={closeToast}
        />
      )}
    </div>
  )
}
