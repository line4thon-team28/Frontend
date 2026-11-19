import useLiveCandidateDetail from '../../hooks/useLiveCandidateDetail'
import { Link } from 'react-router-dom'
import pawIcon from '../../assets/icons/paw.svg'
import StatusView from '../../components/StatusView/StatusView'
import layout from '../../layouts/PetPageLayout.module.css'
import DetailHeader from '../../components/CandidateDetail/DetailHeader'
import ShelterDetails from '../../components/CandidateDetail/ShelterDetails'
import SightingDetails from '../../components/CandidateDetail/SightingDetails'
import styles from '../../components/CandidateDetail/CandidateDetail.module.css'

export default function CandidateDetailPage() {
  return <CandidateDetail model={useLiveCandidateDetail()} />
}

function CandidateDetail({ model }) {
  const {
    candidate, pet, backTo, isSighting, closed, phone, mapUrl, shelter,
    feedbackEnabled, handleFeedback, loading, error, retry, actionError,
  } = model

  if (loading) return <main className={styles.notFound}><p role="status">후보 정보를 불러오는 중이에요.</p></main>

  if (!candidate) {
    return (
      <main className={styles.notFound}>
        <StatusView
          icon={pawIcon}
          title={error && error.status !== 404 ? "후보 정보를 불러오지 못했어요" : "후보를 찾을 수 없어요"}
          description={error?.message}
          action={error && error.status !== 404 ? <button type="button" onClick={retry}>다시 시도</button> : <Link className={styles.mapLink} to={backTo}>후보 목록으로 돌아가기</Link>}
        />
      </main>
    )
  }

  const contact = pet?.contact?.trim()
  const registrationContact = contact && (
    <section className={styles.facility} aria-label="연락처">
      <span className={`${styles.facilityIcon} ${styles.contactIcon}`} aria-hidden="true">📞</span>
      <div><h2>연락처</h2><p>{contact}</p></div>
    </section>
  )

  return (
    <main className={layout.page}>
      <DetailHeader candidate={candidate} pet={pet} backTo={backTo} isSighting={isSighting} closed={closed} />
      {actionError && <p role="alert">{actionError}</p>}
      {isSighting
        ? <SightingDetails candidate={candidate} feedbackEnabled={feedbackEnabled} onFeedback={handleFeedback} />
        : <ShelterDetails candidate={shelter} closed={closed} mapUrl={mapUrl} phone={phone}>{registrationContact}</ShelterDetails>}
    </main>
  )
}
