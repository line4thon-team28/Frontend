import lockIcon from '../../assets/icons/lock.svg'
import Button from '../Button/Button'
import PetFeaturesField from '../PetFeaturesField/PetFeaturesField'
import PetPhoto from '../PetPhoto/PetPhoto'
import PetStatusBadge from '../PetStatusBadge/PetStatusBadge'
import TextField from '../TextField/TextField'
import layout from '../../layouts/PetPageLayout.module.css'
import { formatPetDate, formatPetDescription } from '../../utils/formatPetInfo'
import { useEditRegistrationForm } from '../../hooks/useEditRegistrationPage'
import styles from './EditRegistrationForm.module.css'

function LockedInfo({ pet }) {
  const fields = [
    ['사진', `${pet.photoCount}장`],
    ['종 · 품종 · 성별', formatPetDescription(pet)],
    ['실종', [formatPetDate(pet.lostDate, true), pet.district || pet.city].filter(Boolean).join(' · ')],
  ]

  return (
    <section className={styles.lockedInfo} aria-labelledby="locked-registration-heading">
      <h2 id="locked-registration-heading">바꿀 수 없는 정보</h2>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}<img src={lockIcon} width="14" height="14" alt="" /></dd>
          </div>
        ))}
      </dl>
      <p>매칭 기준이 되는 정보라 바꿀 수 없어요. 잘못 등록했다면 새로 등록해 주세요.</p>
    </section>
  )
}

export default function EditRegistrationForm({ pet, onSave }) {
  const { features, changeFeatures, submit } = useEditRegistrationForm(pet, onSave)

  return (
    <form className={`${layout.form} ${styles.form}`} onSubmit={submit}>
      <div className={styles.editPet}>
        <PetPhoto photo={pet.photo} className={styles.photo} />
        <div><h2>{pet.name}</h2><PetStatusBadge found={pet.status === 'found'} /></div>
      </div>
      <LockedInfo pet={pet} />
      <PetFeaturesField id="registration-features" value={features} onChange={changeFeatures} variant="edit" />
      <TextField label="연락처" name="contact" type="tel" autoComplete="tel" defaultValue={pet.contact || ''} />
      <div className={styles.saveAction}><Button type="submit" className={styles.saveButton}>저장하기</Button></div>
    </form>
  )
}
