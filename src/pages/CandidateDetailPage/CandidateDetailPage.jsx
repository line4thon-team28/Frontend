import { Link } from 'react-router-dom'
import pawIcon from '../../assets/icons/paw.svg'
import StatusView from '../../components/StatusView/StatusView'
import layout from '../../layouts/PetPageLayout.module.css'
import DetailHeader from '../../components/CandidateDetail/DetailHeader'
import ShelterDetails from '../../components/CandidateDetail/ShelterDetails'
import SightingDetails from '../../components/CandidateDetail/SightingDetails'
import useCandidateDetailPage from '../../hooks/useCandidateDetailPage'
import styles from '../../components/CandidateDetail/CandidateDetail.module.css'

export default function CandidateDetailPage() {
  const {
    candidate, pet, backTo, isSighting, closed, phone, mapUrl, shelter,
    scenario, feedbackEnabled, toggleShelterPreview, handleFeedback,
  } = useCandidateDetailPage()

  if (!candidate) {
    return (
      <main className={styles.notFound}>
        <StatusView
          icon={pawIcon}
          title="후보를 찾을 수 없어요"
          action={<Link className={styles.mapLink} to={backTo}>후보 목록으로 돌아가기</Link>}
        />
      </main>
    )
  }

  return (
    <main className={layout.page}>
      <DetailHeader candidate={candidate} pet={pet} backTo={backTo} isSighting={isSighting} closed={closed} />
      {isSighting
        ? <SightingDetails candidate={candidate} feedbackEnabled={feedbackEnabled} onFeedback={handleFeedback} />
        : <ShelterDetails candidate={shelter} closed={closed} mapUrl={mapUrl} phone={phone} scenario={scenario} onPreview={toggleShelterPreview} />}
    </main>
  )
}
