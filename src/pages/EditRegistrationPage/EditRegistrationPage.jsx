import { Link } from 'react-router-dom'
import errorIcon from '../../assets/icons/error.svg'
import StatusView from '../../components/StatusView/StatusView'
import PageBackHeader from '../../components/PageBackHeader/PageBackHeader'
import layout from '../../layouts/PetPageLayout.module.css'
import { petPaths } from '../../routes/petPaths'
import EditRegistrationForm from '../../components/EditRegistrationForm/EditRegistrationForm'
import useEditRegistrationPage from '../../hooks/useEditRegistrationPage'
import styles from '../../components/EditRegistrationForm/EditRegistrationForm.module.css'

export default function EditRegistrationPage() {
  const { pet, save } = useEditRegistrationPage()

  return (
    <main className={`${layout.page} ${layout.padded} ${styles.editPage}`}>
      <PageBackHeader title="등록 정보 수정" fallbackPath={petPaths.registrations} className={styles.editHeader} />
      {pet ? (
        <EditRegistrationForm key={pet.id} pet={pet} onSave={save} />
      ) : (
        <div className={layout.registrationState}>
          <StatusView
            icon={errorIcon}
            tone="error"
            title="등록한 아이를 찾을 수 없어요"
            action={<Link className={`${layout.actionLink} ${layout.outlineLink}`} to={petPaths.registrations}>내 등록으로 돌아가기</Link>}
          />
        </div>
      )}
    </main>
  )
}
