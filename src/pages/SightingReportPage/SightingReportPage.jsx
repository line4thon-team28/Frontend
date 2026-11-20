import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSighting } from '../../apis/sightings'
import BackButton from '../../components/BackButton/BackButton'
import Button from '../../components/Button/Button'
import FormAlert from '../../components/FormAlert/FormAlert'
import LocationField from '../../components/LocationField/LocationField'
import SightingPhotoField from '../../components/SightingPhotoField/SightingPhotoField'
import SightingResult from '../../components/SightingResult/SightingResult'
import TextField from '../../components/TextField/TextField'
import {
  EMPTY_MANUAL_REGION,
  MAX_SIGHTING_PHOTOS,
  SIGHTING_MEMO_MAX_LENGTH,
  SIGHTING_PLACE_MAX_LENGTH,
  SIGHTING_TRAIT_MAX_LENGTH,
  SPECIES_OPTIONS,
} from '../../constants/sighting'
import useAuth from '../../hooks/useAuth'
import useCurrentRegion from '../../hooks/useCurrentRegion'
import usePhotoPreviews from '../../hooks/usePhotoPreviews'
import { formatClock, formatDayAndClock, toLocalDateTimeValue } from '../../utils/dateTime'
import { resizeImage } from '../../utils/resizeImage'
import styles from './SightingReportPage.module.css'

const PHOTO_FORMAT_ERROR = 'JPG, PNG 사진만 올릴 수 있어요.'
const PHOTO_LIMIT_ERROR = `사진은 최대 ${MAX_SIGHTING_PHOTOS}장까지 올릴 수 있어요.`

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
  const { photos, addPhotos, removePhoto, clearPhotos } = usePhotoPreviews({
    limit: MAX_SIGHTING_PHOTOS,
    prepareFile: resizeImage,
  })
  const [photoError, setPhotoError] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [color, setColor] = useState('')
  const [place, setPlace] = useState('')
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [manualRegion, setManualRegion] = useState(EMPTY_MANUAL_REGION)
  const [seenAt, setSeenAt] = useState(() => new Date())
  const [isSeenAtEdited, setIsSeenAtEdited] = useState(false)
  const [maxSeenAt, setMaxSeenAt] = useState(() => toLocalDateTimeValue(new Date()))
  const [memo, setMemo] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submission, setSubmission] = useState(null)

  const homePath = isAuthenticated ? '/home' : '/start'
  const location = resolveLocation(currentRegion, isEditingLocation, manualRegion)
  const missingCount = [photos.length > 0, Boolean(species), Boolean(location)].filter((filled) => !filled).length
  const canSubmit = missingCount === 0

  const handleAddPhotos = async (files) => {
    setPhotoError('')
    setSubmitError('')
    const result = await addPhotos(files)
    if (result?.rejected) {
      setPhotoError(PHOTO_FORMAT_ERROR)
    } else if (result?.limitReached) {
      setPhotoError(PHOTO_LIMIT_ERROR)
    }
  }

  const handleRemovePhoto = (url) => {
    setPhotoError('')
    removePhoto(url)
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
        place,
        memo,
        breed,
        color,
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
    clearPhotos()
    setPhotoError('')
    setSpecies('')
    setBreed('')
    setColor('')
    setPlace('')
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
    if (missingCount > 0) return `필수 항목 ${missingCount}개를 채워주세요`
    return '제보하기'
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <BackButton fallbackPath={homePath} />
        <p className={styles.headerTitle}>목격 제보</p>
      </header>

      <h1 className={styles.title}>목격한 아이를 알려주세요</h1>
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
                    onChange={() => {
                      setSpecies(option.value)
                      setBreed('')
                    }}
                    className={styles.hiddenInput}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.row}>
            <TextField
              label={<>품종 <span className={styles.optional}>선택</span></>}
              name="breed"
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
              maxLength={SIGHTING_TRAIT_MAX_LENGTH}
            />
            <TextField
              label={<>털색 <span className={styles.optional}>선택</span></>}
              name="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              maxLength={SIGHTING_TRAIT_MAX_LENGTH}
            />
          </div>

          <LocationField
            currentRegion={currentRegion}
            isEditing={isEditingLocation}
            onEdit={() => setIsEditingLocation(true)}
            onUseCurrent={() => setIsEditingLocation(false)}
            manualValue={manualRegion}
            onManualChange={setManualRegion}
          />

          <TextField
            label={<>상세 목격 장소 <span className={styles.optional}>선택</span></>}
            name="place"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            maxLength={SIGHTING_PLACE_MAX_LENGTH}
            placeholder="예: 공원 입구, 편의점 앞"
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
                placeholder={`${SIGHTING_MEMO_MAX_LENGTH}자 이내`}
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
