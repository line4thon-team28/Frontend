import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSighting } from '../../apis/sightings'
import BackButton from '../../components/BackButton/BackButton'
import Button from '../../components/Button/Button'
import FormAlert from '../../components/FormAlert/FormAlert'
import LocationField from '../../components/LocationField/LocationField'
import SightingPhotoField from '../../components/SightingPhotoField/SightingPhotoField'
import SightingResult from '../../components/SightingResult/SightingResult'
import {
  EMPTY_MANUAL_REGION,
  MAX_SIGHTING_PHOTOS,
  SIGHTING_MEMO_MAX_LENGTH,
  SPECIES_OPTIONS,
} from '../../constants/sighting'
import useAuth from '../../hooks/useAuth'
import useCurrentRegion from '../../hooks/useCurrentRegion'
import { formatClock, formatDayAndClock, toLocalDateTimeValue } from '../../utils/dateTime'
import { resizeImage } from '../../utils/resizeImage'
import styles from './SightingReportPage.module.css'

const PHOTO_FORMAT_ERROR = 'JPG, PNG 사진만 올릴 수 있어요.'
const PHOTO_LIMIT_ERROR = `사진은 최대 ${MAX_SIGHTING_PHOTOS}장까지 올릴 수 있어요.`

function revokePhotos(photos) {
  photos.forEach((photo) => URL.revokeObjectURL(photo.url))
}

function resolveLocation(currentRegion, isEditingLocation, manualRegion) {
  if (currentRegion.status === 'found' && !isEditingLocation) {
    const { sido, sigungu, dong } = currentRegion.region
    return { sido, sigungu, label: dong || sigungu }
  }
  const sigungu = manualRegion.sigungu.trim()
  if (!manualRegion.sidoCode || !sigungu) return null
  return { sido: manualRegion.sidoCode, sigungu, label: sigungu }
}

export default function SightingReportPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const currentRegion = useCurrentRegion()
  const photoId = useRef(0)
  const photosRef = useRef([])

  const [photos, setPhotos] = useState([])
  const [photoError, setPhotoError] = useState('')
  const [species, setSpecies] = useState('')
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [manualRegion, setManualRegion] = useState(EMPTY_MANUAL_REGION)
  const [seenAt, setSeenAt] = useState(() => new Date())
  const [isSeenAtEdited, setIsSeenAtEdited] = useState(false)
  const [maxSeenAt, setMaxSeenAt] = useState(() => toLocalDateTimeValue(new Date()))
  const [memo, setMemo] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(() => () => revokePhotos(photosRef.current), [])

  const homePath = isAuthenticated ? '/home' : '/start'
  const location = resolveLocation(currentRegion, isEditingLocation, manualRegion)
  const hasRequiredMedia = photos.length > 0 && Boolean(location)
  const canSubmit = hasRequiredMedia && Boolean(species)

  const handleAddPhotos = async (files) => {
    setPhotoError('')
    setSubmitError('')
    const remaining = MAX_SIGHTING_PHOTOS - photos.length
    const accepted = files.slice(0, remaining)
    const results = await Promise.allSettled(accepted.map((file) => resizeImage(file)))
    const added = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => {
        photoId.current += 1
        return { id: photoId.current, file: result.value, url: URL.createObjectURL(result.value) }
      })

    setPhotos((prev) => {
      const next = [...prev, ...added]
      revokePhotos(next.slice(MAX_SIGHTING_PHOTOS))
      return next.slice(0, MAX_SIGHTING_PHOTOS)
    })
    if (added.length < accepted.length) {
      setPhotoError(PHOTO_FORMAT_ERROR)
    } else if (files.length > remaining) {
      setPhotoError(PHOTO_LIMIT_ERROR)
    }
  }

  const handleRemovePhoto = (id) => {
    setPhotoError('')
    setPhotos((prev) => {
      revokePhotos(prev.filter((photo) => photo.id === id))
      return prev.filter((photo) => photo.id !== id)
    })
  }

  const handleSeenAtFocus = (event) => {
    setMaxSeenAt(toLocalDateTimeValue(new Date()))
    try {
      event.currentTarget.showPicker?.()
    } catch {
      return
    }
  }

  const handleSeenAtChange = (event) => {
    if (!event.target.value) return
    const picked = new Date(event.target.value)
    const now = new Date()
    setSeenAt(picked > now ? now : picked)
    setIsSeenAtEdited(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const result = await createSighting({
        photos: photos.map((photo) => photo.file),
        species,
        sido: location.sido,
        sigungu: location.sigungu,
        seenAt: toLocalDateTimeValue(seenAt),
        memo: memo.trim(),
      })
      setSubmission({ result, photoUrl: photos[0].url, placeLabel: location.label, seenAt })
      window.scrollTo(0, 0)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReportAgain = () => {
    revokePhotos(photos)
    setPhotos([])
    setPhotoError('')
    setSpecies('')
    setMemo('')
    setSeenAt(new Date())
    setIsSeenAtEdited(false)
    setSubmitError('')
    setSubmission(null)
    window.scrollTo(0, 0)
  }

  if (submission) {
    return (
      <SightingResult
        initialResult={submission.result}
        photoUrl={submission.photoUrl}
        placeLabel={submission.placeLabel}
        seenAt={submission.seenAt}
        onReportAgain={handleReportAgain}
        onGoHome={() => navigate(homePath)}
      />
    )
  }

  const submitLabel = () => {
    if (isSubmitting) return '제보하는 중'
    if (!hasRequiredMedia) return '사진과 위치를 넣으면 제보할 수 있어요'
    if (!species) return '동물 종류를 고르면 제보할 수 있어요'
    return '제보하기'
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <BackButton fallbackPath={homePath} />
        <p className={styles.headerTitle}>목격 제보</p>
      </header>

      <h1 className={styles.title}>사진과 위치만 남겨주세요</h1>
      <p className={styles.description}>로그인 없이 제보할 수 있어요. 제보자 정보는 저장하지 않아요.</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <SightingPhotoField
            photos={photos}
            max={MAX_SIGHTING_PHOTOS}
            onAdd={handleAddPhotos}
            onRemove={handleRemovePhoto}
            error={photoError}
          />

          <fieldset className={styles.speciesField}>
            <legend className={styles.label}>
              동물 종류 <span className={styles.required}>*</span>
            </legend>
            <div className={styles.chips}>
              {SPECIES_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`${styles.chip} ${species === option.value ? styles.chipSelected : ''}`}
                >
                  <input
                    type="radio"
                    name="species"
                    value={option.value}
                    checked={species === option.value}
                    onChange={() => setSpecies(option.value)}
                    className={styles.hiddenInput}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <LocationField
            currentRegion={currentRegion}
            isEditing={isEditingLocation}
            onEdit={() => setIsEditingLocation(true)}
            onUseCurrent={() => setIsEditingLocation(false)}
            manualValue={manualRegion}
            onManualChange={setManualRegion}
          />

          <div className={styles.row}>
            <div className={styles.cell}>
              <label htmlFor="sighting-seen-at" className={styles.smallLabel}>
                목격 시각
              </label>
              <div className={styles.box}>
                <span className={styles.boxText}>
                  {isSeenAtEdited ? formatDayAndClock(seenAt) : `지금 · ${formatClock(seenAt)}`}
                </span>
                <input
                  id="sighting-seen-at"
                  type="datetime-local"
                  className={styles.timeInput}
                  value={toLocalDateTimeValue(seenAt)}
                  max={maxSeenAt}
                  onFocus={handleSeenAtFocus}
                  onClick={handleSeenAtFocus}
                  onChange={handleSeenAtChange}
                />
              </div>
            </div>
            <div className={styles.cell}>
              <label htmlFor="sighting-memo" className={styles.smallLabel}>
                메모 <span className={styles.optional}>선택</span>
              </label>
              <input
                id="sighting-memo"
                className={`${styles.box} ${styles.memoInput}`}
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                maxLength={SIGHTING_MEMO_MAX_LENGTH}
                placeholder="빨간 목줄, 사람 경계"
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          {submitError && <FormAlert className={styles.submitError}>{submitError}</FormAlert>}
          <Button
            type="submit"
            className={`${styles.submit} ${canSubmit ? '' : styles.submitBlocked}`}
            disabled={!canSubmit || isSubmitting}
            aria-busy={isSubmitting || undefined}
          >
            {submitLabel()}
          </Button>
        </div>
      </form>
    </main>
  )
}
