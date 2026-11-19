import { Link } from 'react-router-dom'
import errorIcon from '../../assets/icons/error.svg'
import pawIcon from '../../assets/icons/paw.svg'
import refreshIcon from '../../assets/icons/refresh.svg'
import Button from '../../components/Button/Button'
import PetCardSkeleton from '../../components/PetCardSkeleton/PetCardSkeleton'
import StatusView from '../../components/StatusView/StatusView'
import layout from '../../layouts/PetPageLayout.module.css'
import { petPaths } from '../../routes/petPaths'
import RegistrationCard from '../../components/MyRegistrations/RegistrationCard'
import useMyRegistrationsPage from '../../hooks/useMyRegistrationsPage'
import styles from '../../components/MyRegistrations/MyRegistrations.module.css'

export { default as EditRegistrationPage } from '../EditRegistrationPage/EditRegistrationPage'

function RegistrationSkeleton() {
  return (
    <div role="status" aria-label="내 등록을 불러오는 중" className={styles.cards}>
      {[1, 2].map((index) => (
        <PetCardSkeleton key={index} className={`${layout.card} ${styles.card}`} variant="registration" />
      ))}
    </div>
  )
}

function NewRegistrationLink({ empty = false }) {
  const variant = empty ? styles.emptyLink : styles.newLink

  return (
    <Link className={`${layout.actionLink} ${variant}`} to={petPaths.newRegistration}>
      <span className={styles.plus} aria-hidden="true">+</span> {empty ? '실종 등록하기' : '새 실종 등록'}
    </Link>
  )
}

export default function MyRegistrationsPage() {
  const { markFound, loading, error, empty, nickname, searchingPets, foundPets, retry, actionError, busy } = useMyRegistrationsPage()

  let content
  if (loading) {
    content = <RegistrationSkeleton />
  } else if (error) {
    content = (
      <div className={layout.registrationState}>
        <StatusView
          icon={errorIcon}
          tone="error"
          title="내 등록을 불러오지 못했어요"
          description={'인터넷 연결을 확인하고\n다시 시도해 주세요.'}
          action={<Button variant="dark" size="medium" icon={refreshIcon} onClick={retry}>다시 시도</Button>}
        />
      </div>
    )
  } else if (empty) {
    content = (
      <div className={layout.registrationState}>
        <StatusView
          icon={pawIcon}
          title="아직 등록한 아이가 없어요"
          description={'잃어버린 아이의 사진을 올리면\n보호소 공고를 매일 대신 찾아봐요.'}
          action={<NewRegistrationLink empty />}
        />
      </div>
    )
  } else {
    content = (
      <>
        <ul className={styles.cards}>
          {[...searchingPets, ...foundPets].map((pet) => (
            <li key={pet.id}>
              <RegistrationCard pet={pet} onFound={markFound} busy={busy} />
            </li>
          ))}
        </ul>
        <NewRegistrationLink />
      </>
    )
  }

  return (
    <div className={`${layout.tabPage} ${layout.padded} ${styles.page}`}>
      <header>
        <div className={styles.headingRow}>
          <h1 className={styles.heading}>내 등록</h1>
        </div>
        <p className={styles.greeting}>
          {nickname}님{!loading && !error && !empty && ` · 찾는 중 ${searchingPets.length} · 찾음 ${foundPets.length}`}
        </p>
      </header>
      {actionError && <p role="alert">{actionError}</p>}
      {content}
    </div>
  )
}
