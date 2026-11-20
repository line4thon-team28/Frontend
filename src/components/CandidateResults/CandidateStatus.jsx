import { Link } from 'react-router-dom'
import errorIcon from '../../assets/icons/error.svg'
import PetPhoto from '../PetPhoto/PetPhoto'
import refreshIcon from '../../assets/icons/refresh.svg'
import Button from '../Button/Button'
import PetCardSkeleton from '../PetCardSkeleton/PetCardSkeleton'
import StatusView from '../StatusView/StatusView'
import layout from '../../layouts/PetPageLayout.module.css'
import { petPaths } from '../../routes/petPaths'
import styles from './CandidateResults.module.css'

function Notice({ tone = 'warning', title, children }) {
  return (
    <div className={`${styles.notice} ${tone === 'muted' ? styles.noticeMuted : ''}`}>
      <span className={styles.noticeIcon} aria-hidden="true">!</span>
      <div>
        {title && <strong>{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  )
}

function WaitingStatus({ title, description, children }) {
  return (
    <section className={styles.waitingStatus}>
      <div className={styles.clockBadge} aria-hidden="true"><span /></div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  )
}

export default function CandidateStatus({ phase, pet, found, retryAnalysis, retryLoading, processingMessage, busy, hasCandidates }) {
  return (
    <>
    {phase === 'loading' && (
      <div className={styles.stack} role="progressbar" aria-label="후보 불러오는 중">
        {[1, 2, 3].map(index => <PetCardSkeleton key={index} className={`${layout.card} ${styles.card}`} />)}
      </div>
    )}

    {phase === 'analyzing' && hasCandidates && (
      <Notice title="추가 사진 비교 중">
        {processingMessage || '추가 사진을 계속 비교하고 있어요. 확인된 후보부터 먼저 보여드릴게요.'}
      </Notice>
    )}

    {phase === 'analyzing' && !hasCandidates && (
      <div className={styles.stack}>
        <section className={styles.analyzingCard}>
          <div className={styles.progressPhoto} role="progressbar" aria-label="사진 분석 중"><PetPhoto photo={pet?.photo} /></div>
          <h2>사진 분석 중이에요</h2>
          <p>{processingMessage || '10초마다 자동으로 새로고침돼요.'}</p>
        </section>
        <PetCardSkeleton className={`${layout.card} ${styles.card}`} />
      </div>
    )}

    {phase === 'analysis-error' && (
      <>
        <Notice title="등록은 저장됐어요">사진 분석에 실패했어요. 잠시 후 다시 비교할게요.</Notice>
        <div className={`${layout.centeredState} ${styles.centered}`}>
          <WaitingStatus title="사진 분석에 실패했어요" description="다음 주기에 자동으로 다시 비교해요. 지금 바로 다시 분석할 수도 있어요.">
            <Button variant="dark" size="medium" className={styles.retryButton} disabled={busy} onClick={retryAnalysis}>다시 분석하기</Button>
          </WaitingStatus>
        </div>
      </>
    )}

    {phase === 'pending' && (
      <div className={`${layout.centeredState} ${styles.centered}`}>
        <WaitingStatus title="매칭에 필요한 등록 정보를 기다리고 있어요" description="등록 정보가 저장되면 바로 비교를 시작해요.">
          {!pet && <Link className={styles.retryButton} to={petPaths.newRegistration}>실종 등록하기</Link>}
        </WaitingStatus>
      </div>
    )}

    {phase === 'error' && (
      <div className={`${layout.centeredState} ${styles.centered}`}>
        <StatusView
          tone="error"
          icon={errorIcon}
          title="후보를 불러오지 못했어요"
          description={'인터넷 연결을 확인하고\n다시 시도해 주세요.'}
          action={
            <Button variant="dark" size="medium" icon={refreshIcon} className={styles.retryButton} onClick={retryLoading}>
              다시 시도
            </Button>
          }
        />
      </div>
    )}

    {phase === 'partial' && <Notice>일부 후보 사진을 분석하지 못했어요. 확인된 후보부터 보여드릴게요.</Notice>}
    {found && <Notice tone="muted">찾음 처리되어 새로운 비교를 중단했어요</Notice>}
    </>
  )
}
