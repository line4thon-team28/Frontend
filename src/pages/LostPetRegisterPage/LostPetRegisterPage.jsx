import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchBreeds, fetchSidoList, fetchSigunguList } from '../../apis/codes'
import { createLostPet } from '../../apis/lostPets'
import lockSmallIcon from '../../assets/icons/lock-small.svg'
import BackButton from '../../components/BackButton/BackButton'
import Button from '../../components/Button/Button'
import FieldError from '../../components/FieldError/FieldError'
import FormAlert from '../../components/FormAlert/FormAlert'
import PhotoPicker from '../../components/PhotoPicker/PhotoPicker'
import SelectBox from '../../components/SelectBox/SelectBox'
import {
  MAX_COLOR_LENGTH,
  MAX_FEATURE_LENGTH,
  MAX_PHOTO_BYTES,
  MAX_PHOTO_COUNT,
  SEX_OPTIONS,
  SPECIES_OPTIONS,
} from '../../constants/lostPet'
import { getLostDateRange } from '../../utils/date'
import { resizeImage } from '../../utils/resizeImage'
import styles from './LostPetRegisterPage.module.css'

const UNKNOWN_BREED = '모름'
const PHOTO_REQUIRED_MESSAGE = '사진을 1장 이상 올려주세요'
const LIST_LOAD_ERROR_MESSAGE = '목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'

function getRequiredErrors({ photos, species, lostDate, sidoCode, sigunguCode }, dateRange) {
  let lostDateError = ''
  if (!lostDate) {
    lostDateError = '날짜를 골라 주세요'
  } else if (lostDate < dateRange.min || lostDate > dateRange.max) {
    lostDateError = '오늘부터 1년 전까지의 날짜만 고를 수 있어요'
  }

  let locationError = ''
  if (!sidoCode) {
    locationError = '실종 위치를 골라 주세요'
  } else if (!sigunguCode) {
    locationError = '시군구까지 골라 주세요'
  }

  return {
    photos: photos.length === 0 ? PHOTO_REQUIRED_MESSAGE : '',
    species: species ? '' : '종을 골라 주세요',
    lostDate: lostDateError,
    location: locationError,
  }
}

export default function LostPetRegisterPage() {
  const navigate = useNavigate()
  const [dateRange] = useState(() => getLostDateRange())
  const previewUrls = useRef(new Set())
  const latestSidoCode = useRef('')

  const [photos, setPhotos] = useState([])
  const [photoNotice, setPhotoNotice] = useState('')
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false)
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState(UNKNOWN_BREED)
  const [sex, setSex] = useState('UNKNOWN')
  const [color, setColor] = useState('')
  const [lostDate, setLostDate] = useState('')
  const [sidoCode, setSidoCode] = useState('')
  const [sigunguCode, setSigunguCode] = useState('')
  const [feature, setFeature] = useState('')
  const [contact, setContact] = useState('')

  const [breedNames, setBreedNames] = useState([])
  const [sidoOptions, setSidoOptions] = useState([])
  const [sigunguOptions, setSigunguOptions] = useState([])
  const [listError, setListError] = useState('')

  const [touched, setTouched] = useState({ photos: false, species: false, lostDate: false, location: false })
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const urls = previewUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  useEffect(() => {
    fetchSidoList()
      .then((list) => setSidoOptions(list.map(({ code, name }) => ({ value: code, label: name }))))
      .catch(() => setListError(LIST_LOAD_ERROR_MESSAGE))
  }, [])

  const requiredErrors = getRequiredErrors({ photos, species, lostDate, sidoCode, sigunguCode }, dateRange)
  const remainingCount = Object.values(requiredErrors).filter(Boolean).length
  const isComplete = remainingCount === 0
  const visibleError = (field) => (touched[field] ? requiredErrors[field] : '')
  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  const handleSelectPhotos = async (files) => {
    const room = MAX_PHOTO_COUNT - photos.length
    const selected = files.slice(0, room)
    setIsProcessingPhotos(true)
    setPhotoNotice('')

    const resized = await Promise.all(selected.map((file) => resizeImage(file)))
    const accepted = resized.filter((file) => file.size <= MAX_PHOTO_BYTES)
    const added = accepted.map((file) => {
      const previewUrl = URL.createObjectURL(file)
      previewUrls.current.add(previewUrl)
      return { id: crypto.randomUUID(), file, previewUrl }
    })

    setPhotos((prev) => [...prev, ...added])
    setIsProcessingPhotos(false)
    markTouched('photos')
    if (accepted.length < resized.length) {
      setPhotoNotice('사진 용량이 너무 커요')
    } else if (files.length > room) {
      setPhotoNotice(`사진은 최대 ${MAX_PHOTO_COUNT}장까지 올릴 수 있어요`)
    }
  }

  const handleRemovePhoto = (id) => {
    const target = photos.find((photo) => photo.id === id)
    if (target) {
      URL.revokeObjectURL(target.previewUrl)
      previewUrls.current.delete(target.previewUrl)
    }
    setPhotos((prev) => prev.filter((photo) => photo.id !== id))
    setPhotoNotice('')
    markTouched('photos')
  }

  const handleSpeciesChange = (value) => {
    setSpecies(value)
    setBreed(UNKNOWN_BREED)
    setBreedNames([])
    markTouched('species')
    fetchBreeds(value)
      .then(setBreedNames)
      .catch(() => setListError(LIST_LOAD_ERROR_MESSAGE))
  }

  const handleSidoChange = (event) => {
    const code = event.target.value
    latestSidoCode.current = code
    setSidoCode(code)
    setSigunguCode('')
    setSigunguOptions([])
    fetchSigunguList(code)
      .then((list) => {
        if (latestSidoCode.current !== code) return
        setSigunguOptions(list.map(({ code: value, name }) => ({ value, label: name })))
      })
      .catch(() => setListError(LIST_LOAD_ERROR_MESSAGE))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setTouched({ photos: true, species: true, lostDate: true, location: true })
    if (!isComplete) return

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const { lostPetId } = await createLostPet({
        photos: photos.map((photo) => photo.file),
        species,
        breed: breed === UNKNOWN_BREED ? null : breed,
        sex,
        color: color.trim() || null,
        lostDate,
        sidoCode,
        sigunguCode,
        feature: feature.trim() || null,
        contact: contact.trim() || null,
      })
      navigate(`/lost-pets/${lostPetId}/matches`, { replace: true })
    } catch (error) {
      if (error.message === PHOTO_REQUIRED_MESSAGE) {
        setPhotoNotice(error.message)
      } else {
        setSubmitError(error.message)
      }
      setIsSubmitting(false)
    }
  }

  const breedOptions = [UNKNOWN_BREED, ...breedNames].map((name) => ({ value: name, label: name }))
  const photoError = photoNotice || visibleError('photos')
  const lostDateError = visibleError('lostDate')
  const locationError = visibleError('location')

  let submitLabel = '등록하고 바로 비교하기'
  if (!isComplete) submitLabel = `필수 항목 ${remainingCount}개를 채워주세요`
  else if (isSubmitting) submitLabel = '등록하는 중...'

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <BackButton fallbackPath="/home" />
        <h1 className={styles.title}>실종 등록</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <PhotoPicker
          label="사진"
          required
          photos={photos}
          max={MAX_PHOTO_COUNT}
          error={photoError}
          isProcessing={isProcessingPhotos}
          onSelectFiles={handleSelectPhotos}
          onRemove={handleRemovePhoto}
        />

        <fieldset className={styles.speciesField}>
          <legend className={styles.sectionLabel}>
            종<span className={styles.required}> *</span>
          </legend>
          <div className={styles.segment} role="radiogroup">
            {SPECIES_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={species === option.value}
                className={`${styles.segmentButton} ${species === option.value ? styles.selected : ''}`}
                onClick={() => handleSpeciesChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {visibleError('species') && <FieldError>{visibleError('species')}</FieldError>}
        </fieldset>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="breed" className={styles.label}>
              품종
            </label>
            <SelectBox id="breed" options={breedOptions} value={breed} onChange={(event) => setBreed(event.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="sex" className={styles.label}>
              성별
            </label>
            <SelectBox id="sex" options={SEX_OPTIONS} value={sex} onChange={(event) => setSex(event.target.value)} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="color" className={styles.label}>
              털색
            </label>
            <input
              id="color"
              className={styles.input}
              placeholder="예: 치즈, 검정"
              maxLength={MAX_COLOR_LENGTH}
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="lostDate" className={styles.label}>
              실종 날짜<span className={styles.required}> *</span>
            </label>
            <input
              id="lostDate"
              type="date"
              className={`${styles.input} ${styles.dateInput} ${lostDateError ? styles.invalid : ''} ${lostDate ? '' : styles.emptyDate}`}
              min={dateRange.min}
              max={dateRange.max}
              value={lostDate}
              onChange={(event) => setLostDate(event.target.value)}
              onBlur={() => markTouched('lostDate')}
              aria-invalid={lostDateError ? true : undefined}
              aria-describedby={lostDateError ? 'lostDate-error' : undefined}
            />
            {lostDateError && <FieldError id="lostDate-error">{lostDateError}</FieldError>}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>
            실종 위치<span className={styles.required}> *</span>
          </span>
          <div className={styles.row}>
            <SelectBox
              aria-label="실종 위치 시도"
              options={sidoOptions}
              placeholder="시도"
              value={sidoCode}
              invalid={Boolean(locationError) && !sidoCode}
              onChange={handleSidoChange}
              onBlur={() => !sidoCode && markTouched('location')}
            />
            <SelectBox
              aria-label="실종 위치 시군구"
              options={sigunguOptions}
              placeholder="시군구"
              value={sigunguCode}
              disabled={!sidoCode}
              invalid={Boolean(locationError) && Boolean(sidoCode)}
              onChange={(event) => setSigunguCode(event.target.value)}
              onBlur={() => markTouched('location')}
            />
          </div>
          {locationError && <FieldError>{locationError}</FieldError>}
          {listError && <FieldError>{listError}</FieldError>}
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="feature" className={styles.label}>
              특징
            </label>
            <span className={styles.counter}>
              {feature.length} / {MAX_FEATURE_LENGTH}
            </span>
          </div>
          <textarea
            id="feature"
            className={styles.textarea}
            placeholder="예: 치즈 태비, 빨간 목줄, 왼쪽 귀 끝 살짝 접힘"
            maxLength={MAX_FEATURE_LENGTH}
            rows={2}
            value={feature}
            onChange={(event) => setFeature(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact" className={styles.label}>
            연락처 <span className={styles.optional}>선택</span>
          </label>
          <input
            id="contact"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={`${styles.input} ${styles.contactInput}`}
            placeholder="010-1234-5678"
            maxLength={13}
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            aria-describedby="contact-hint"
          />
          <p id="contact-hint" className={styles.hint}>
            <img src={lockSmallIcon} alt="" />
            목격자에게는 공개되지 않아요. 본인만 볼 수 있어요.
          </p>
        </div>

        <div className={styles.bottomBar}>
          {submitError && <FormAlert>{submitError}</FormAlert>}
          <Button
            type="submit"
            className={`${styles.submitButton} ${isComplete ? '' : styles.incomplete}`}
            aria-disabled={!isComplete || isSubmitting}
            aria-busy={isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </main>
  )
}
