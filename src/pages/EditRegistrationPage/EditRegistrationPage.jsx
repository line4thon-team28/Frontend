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
  const { pet, save, saving, saveError, loading, error, retry } = useEditRegistrationPage()

  return (
    <main className={`${layout.page} ${layout.padded} ${styles.editPage}`}>
      <PageBackHeader title="등록 정보 수정" fallbackPath={petPaths.registrations} className={styles.editHeader} />
      {loading ? <p role="status">등록 정보를 불러오는 중이에요.</p> : pet ? (
        <EditRegistrationForm key={pet.id} pet={pet} onSave={save} saving={saving} saveError={saveError} />
      ) : (
        <div className={layout.registrationState}>
          <StatusView
            icon={errorIcon}
            tone="error"
            title={error?.status === 404 || !error ? "등록한 아이를 찾을 수 없어요" : "등록 정보를 불러오지 못했어요"}
            description={error?.message}
            action={error && error.status !== 404 ? <button type="button" onClick={retry}>다시 시도</button> : <Link className={`${layout.actionLink} ${layout.outlineLink}`} to={petPaths.registrations}>내 등록으로 돌아가기</Link>}
          />
        </div>
      )}
    </main>
  )
}
