import alertIcon from '../../assets/icons/alert-field.svg'
import ManualRegionPicker from '../LocationField/ManualRegionPicker'
import TextField from '../TextField/TextField'
import LostDatePicker from './LostDatePicker'
import { SPECIES_LABELS } from '../../apis/pets'
import { FIELD_IDS } from '../../hooks/useLostRegistrationForm'
import styles from './LostRegistrationForm.module.css'

export function RequiredMark() {
  return <span className={styles.required} aria-hidden="true"> *</span>
}

export function FieldError({ id, children }) {
  return (
    <p id={id} className={styles.error}>
      <img src={alertIcon} alt="" />
      {children}
    </p>
  )
}

function Select({ className = '', children, ...props }) {
  return (
    <span className={`${styles.select} ${className}`}>
      <select {...props}>{children}</select>
    </span>
  )
}

export function PetAttributesFields({ values, breeds, invalidDate, changeSpecies, changeDate, updateValue }) {
  return (
    <>
      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>종<RequiredMark /></legend>
        <div className={styles.species}>
          {SPECIES_LABELS.map(species => (
            <label key={species} className={styles.speciesOption}>
              <input
                type="radio"
                name="species"
                value={species}
                checked={values.species === species}
                onChange={() => changeSpecies(species)}
              />
              <span>{species}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <TextField
        label="이름"
        name="name"
        value={values.name}
        onChange={updateValue}
        maxLength={100}
      />

      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span className={styles.label}>품종</span>
          <Select name="breed" value={values.breed} onChange={updateValue}>
            <option value="">모름</option>
            {breeds.map(breed => <option key={breed}>{breed}</option>)}
          </Select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>성별</span>
          <Select name="sex" value={values.sex} onChange={updateValue}>
            <option value="">모름</option>
            <option>수컷</option>
            <option>암컷</option>
          </Select>
        </label>
        <TextField label="털색" name="coat" value={values.coat} onChange={updateValue} placeholder="예: 치즈, 검정" />
        <div className={styles.field}>
          <label id={`${FIELD_IDS.lostDate}-label`} className={styles.label} htmlFor={FIELD_IDS.lostDate}>
            실종 날짜<RequiredMark />
          </label>
          <LostDatePicker
            id={FIELD_IDS.lostDate}
            value={values.lostDate}
            invalid={invalidDate}
            onChange={changeDate}
          />
          {invalidDate && <FieldError id="lost-date-error">날짜를 골라 주세요</FieldError>}
        </div>
      </div>
    </>
  )
}

export function LostLocationFields({ values, invalidDistrict, updateValue, changeRegion }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>실종 위치<RequiredMark /></legend>
      <ManualRegionPicker districtId={FIELD_IDS.districtCode} invalid={invalidDistrict} value={{ sidoCode: values.provinceCode, sigungu: values.districtCode }} onChange={changeRegion} />
      {invalidDistrict && <FieldError id="lost-location-error">시군구까지 골라 주세요</FieldError>}
      <TextField
        label={<>상세 실종 장소 <span className={styles.hint}>선택</span></>}
        name="place"
        value={values.place}
        onChange={updateValue}
        maxLength={300}
        placeholder="예: 공원 입구, 아파트 정문"
      />
    </fieldset>
  )
}

export function RegistrationContactField({ contact, inputRef, onChange }) {
  return (
    <TextField
      id="lost-contact"
      label={<>연락처 <span className={styles.hint}>선택</span></>}
      name="contact"
      type="tel"
      autoComplete="tel"
      ref={inputRef}
      value={contact}
      onChange={onChange}
      placeholder="010-1234-5678"
    />
  )
}
