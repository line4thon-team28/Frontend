import Button from '../Button/Button'
import PetFeaturesField from '../PetFeaturesField/PetFeaturesField'
import PageBackHeader from '../PageBackHeader/PageBackHeader'
import layout from '../../layouts/PetPageLayout.module.css'
import { LostLocationFields, PetAttributesFields, RegistrationContactField } from './RegistrationFields'
import RegistrationPhotoField from './RegistrationPhotoField'
import useLostRegistrationForm from '../../hooks/useLostRegistrationForm'
import styles from './LostRegistrationForm.module.css'

export default function LostRegistrationForm() {
  const {
    submitting, submitError, breeds, changeRegion,
    values, photos, missingCount, invalidPhotos, invalidSpecies, invalidDate, invalidDistrict,
    contactInput, updateValue, changeSpecies, changeDate, addPhotos, removePhoto, submit,
  } = useLostRegistrationForm()

  return (
    <main className={layout.page}>
      <PageBackHeader title="실종 등록" fallbackPath="/home" className={styles.header} />
      <form className={`${layout.form} ${styles.form}`} onSubmit={submit} noValidate>
        <RegistrationPhotoField photos={photos} invalidPhotos={invalidPhotos} addPhotos={addPhotos} removePhoto={removePhoto} />
        <PetAttributesFields
          values={values}
          breeds={breeds}
          invalidSpecies={invalidSpecies}
          invalidDate={invalidDate}
          changeSpecies={changeSpecies}
          changeDate={changeDate}
          updateValue={updateValue}
        />
        <LostLocationFields
          values={values}
          invalidDistrict={invalidDistrict}
          changeRegion={changeRegion}
          updateValue={updateValue}
        />
        <PetFeaturesField id="lost-features" value={values.features} onChange={updateValue} />
        <RegistrationContactField contact={values.contact} inputRef={contactInput} onChange={updateValue} />

        {submitError && <p role="alert">{submitError}</p>}
        <footer className={`${layout.stickyFooter} ${styles.footer}`}>
          <Button className={styles.submit} type="submit" disabled={submitting} data-incomplete={missingCount > 0}>
            {missingCount > 0 ? `필수 항목 ${missingCount}개를 채워주세요` : '등록하고 바로 비교하기'}
          </Button>
        </footer>
      </form>
    </main>
  )
}
