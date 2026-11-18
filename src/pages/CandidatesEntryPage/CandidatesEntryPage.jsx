import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { fetchMyLostPets } from '../../apis/lostPets'
import errorIcon from '../../assets/icons/error.svg'
import pawIcon from '../../assets/icons/paw.svg'
import refreshIcon from '../../assets/icons/refresh.svg'
import Button from '../../components/Button/Button'
import CandidateSkeleton from '../../components/CandidateCard/CandidateSkeleton'
import StatusView from '../../components/StatusView/StatusView'
import styles from './CandidatesEntryPage.module.css'

export default function CandidatesEntryPage() {
  const navigate = useNavigate()
  const [reloadToken, setReloadToken] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchMyLostPets()
      .then((lostPets) => !ignore && setResult({ token: reloadToken, lostPets }))
      .catch((error) => !ignore && setResult({ token: reloadToken, error }))
    return () => {
      ignore = true
    }
  }, [reloadToken])

  if (result?.token !== reloadToken) {
    return (
      <div className={styles.page} aria-busy="true" aria-label="불러오는 중">
        <CandidateSkeleton />
      </div>
    )
  }

  if (result.error) {
    return (
      <div className={`${styles.page} ${styles.centered}`}>
        <StatusView
          icon={errorIcon}
          tone="error"
          title="내 등록을 불러오지 못했어요"
          description={result.error.message}
          action={
            <Button variant="dark" size="medium" icon={refreshIcon} onClick={() => setReloadToken((token) => token + 1)}>
              다시 시도
            </Button>
          }
        />
      </div>
    )
  }

  const target = result.lostPets.find((lostPet) => lostPet.status === 'SEARCHING') ?? result.lostPets[0]
  if (target) {
    return <Navigate to={`/lost-pets/${target.lostPetId}/matches`} replace />
  }

  return (
    <div className={`${styles.page} ${styles.centered}`}>
      <StatusView
        icon={pawIcon}
        title="아직 등록한 실종 정보가 없어요"
        description={'실종 등록을 하면 보호소 공고와\n목격 제보 중 비슷한 후보를 찾아드려요.'}
        action={
          <Button size="medium" onClick={() => navigate('/lost-pets/new')}>
            실종 등록하기
          </Button>
        }
      />
    </div>
  )
}
