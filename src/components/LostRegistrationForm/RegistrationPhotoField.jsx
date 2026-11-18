import { FieldError, RequiredMark } from './RegistrationFields'
import { FIELD_IDS, PHOTO_LIMIT } from '../../hooks/useLostRegistrationForm'
import styles from './LostRegistrationForm.module.css'

export default function RegistrationPhotoField({ photos, invalidPhotos, addPhotos, removePhoto }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.srOnly}>사진</legend>
      <div className={styles.fieldHeading}>
        <span className={styles.label} aria-hidden="true">사진<RequiredMark /></span>
        <span className={styles.hint} id="lost-photo-hint">{photos.length} / {PHOTO_LIMIT} · 첫 장이 대표</span>
      </div>
      <div className={styles.photoStrip}>
        {photos.length < PHOTO_LIMIT && (
          <label className={`${styles.photoSlot} ${styles.addPhoto} ${invalidPhotos ? styles.invalidPhoto : ''}`}>
            <span aria-hidden="true">+</span>
            <span>촬영·추가</span>
            <input
              id={FIELD_IDS.photos}
              type="file"
              accept="image/*"
              multiple
              aria-invalid={invalidPhotos || undefined}
              aria-describedby={invalidPhotos ? 'lost-photo-hint lost-photo-error' : 'lost-photo-hint'}
              onChange={addPhotos}
            />
          </label>
        )}
        {photos.map(({ url, name }, index) => (
          <div className={styles.photoSlot} key={url}>
            <img src={url} alt={index === 0 ? `대표 사진: ${name}` : name} />
            <button type="button" className={styles.removePhoto} onClick={() => removePhoto(url)} aria-label={`${index + 1}번 사진 삭제`}>×</button>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 3 - photos.length) }, (_, index) => (
          <div key={index} className={styles.photoSlot} aria-hidden="true" />
        ))}
      </div>
      {invalidPhotos && <FieldError id="lost-photo-error">사진을 1장 이상 올려주세요</FieldError>}
    </fieldset>
  )
}
