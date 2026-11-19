import cameraIcon from '../../assets/icons/camera-large.svg'
import styles from './SightingPhotoField.module.css'

const SLOT_COUNT = 3

export default function SightingPhotoField({ photos, max, onAdd, onRemove, error }) {
  const canAdd = photos.length < max
  const fillerCount = Math.max(0, SLOT_COUNT - photos.length - (canAdd ? 2 : 0))

  const handleChange = (event) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length > 0) {
      onAdd(files)
    }
  }

  return (
    <section className={styles.field} aria-labelledby="sighting-photo-label">
      <div className={styles.header}>
        <h2 id="sighting-photo-label" className={styles.label}>
          사진 <span className={styles.required}>*</span>
        </h2>
        <span className={styles.count}>
          {photos.length} / {max}
        </span>
      </div>
      <ul className={styles.slots}>
        {photos.map((photo, index) => (
          <li key={photo.url} className={styles.slot}>
            <img src={photo.url} alt={`제보 사진 ${index + 1}`} className={styles.photo} />
            <button
              type="button"
              className={styles.remove}
              onClick={() => onRemove(photo.url)}
              aria-label={`제보 사진 ${index + 1} 삭제`}
            >
              ×
            </button>
          </li>
        ))}
        {canAdd && (
          <>
            <li className={styles.slot}>
              <label className={`${styles.picker} ${styles.camera}`}>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className={styles.hiddenInput}
                  onChange={handleChange}
                />
                <img src={cameraIcon} alt="" />
                사진 찍기
              </label>
            </li>
            <li className={styles.slot}>
              <label className={`${styles.picker} ${styles.album}`}>
                <input type="file" accept="image/*" multiple className={styles.hiddenInput} onChange={handleChange} />
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
                앨범
              </label>
            </li>
          </>
        )}
        {Array.from({ length: fillerCount }, (_, index) => (
          <li key={`filler-${index}`} className={`${styles.slot} ${styles.filler}`} aria-hidden="true" />
        ))}
      </ul>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
