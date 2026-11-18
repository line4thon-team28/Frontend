import alertIcon from '../../assets/icons/alert-field.svg'
import lockIcon from '../../assets/icons/lock.svg'
import TextField from '../TextField/TextField'
import LostDatePicker from './LostDatePicker'
import { BREEDS, FIELD_IDS } from '../../hooks/useLostRegistrationForm'
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

export function PetAttributesFields({ values, invalidDate, changeSpecies, changeDate, updateValue }) {
  return (
    <>
      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>종<RequiredMark /></legend>
        <div className={styles.species}>
          {Object.keys(BREEDS).map(species => (
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

      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span className={styles.label}>품종</span>
          <Select name="breed" value={values.breed} onChange={updateValue}>
            <option value="">모름</option>
            {BREEDS[values.species].map(breed => <option key={breed}>{breed}</option>)}
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

export function LostLocationFields({ values, provinces, districts, needsDistrict, invalidDistrict, changeProvince, updateValue }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>실종 위치<RequiredMark /></legend>
      <div className={styles.fieldGrid}>
        <Select
          name="provinceCode"
          aria-label="시도"
          value={values.provinceCode}
          onChange={changeProvince}
          required
        >
          {provinces.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
        </Select>
        <Select
          id={FIELD_IDS.districtCode}
          name="districtCode"
          aria-label="시군구"
          value={values.districtCode}
          onChange={updateValue}
          required={needsDistrict}
          disabled={!needsDistrict}
          aria-invalid={invalidDistrict || undefined}
          aria-describedby={invalidDistrict ? 'lost-location-error' : undefined}
        >
          <option value="" disabled>{needsDistrict ? '시군구' : '시군구 선택 없음'}</option>
          {districts.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
        </Select>
      </div>
      {invalidDistrict && <FieldError id="lost-location-error">시군구까지 골라 주세요</FieldError>}
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
      hint={(
        <span className={styles.contactHelp}>
          <img src={lockIcon} alt="" />
          목격자에게는 공개되지 않아요. 본인만 볼 수 있어요.
        </span>
      )}
    />
  )
}
