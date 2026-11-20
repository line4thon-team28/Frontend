import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLostPet, fetchBreeds } from '../apis/pets'
import { candidatesPath } from '../routes/petPaths'
import usePhotoPreviews from './usePhotoPreviews'

export const PHOTO_LIMIT = 5
const EMPTY_FORM = {
  species: '', name: '', breed: '', sex: '', coat: '', lostDate: '',
  provinceCode: '', districtCode: '', place: '', features: '', contact: '',
}
export const FIELD_IDS = { photos: 'lost-photo', species: 'lost-species', lostDate: 'lost-date', districtCode: 'lost-district' }

export default function useLostRegistrationForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY_FORM)
  const { photos, addPhotos: addPreviews, removePhoto } = usePhotoPreviews({ limit: PHOTO_LIMIT })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [breedResult, setBreedResult] = useState(null)
  const species = values.species

  useEffect(() => {
    if (!species) return
    let active = true
    fetchBreeds(species)
      .then(items => { if (active) setBreedResult({ species, items: items.map(item => item.name) }) })
      .catch(() => { if (active) setBreedResult({ species, items: [] }) })
    return () => { active = false }
  }, [species])

  const contactInput = useRef(null)

  const requiredFilled = [
    photos.length > 0,
    Boolean(species),
    Boolean(values.lostDate),
    Boolean(values.provinceCode && values.districtCode.trim()),
  ]
  const missingCount = requiredFilled.filter(filled => !filled).length
  const { photos: invalidPhotos, species: invalidSpecies, lostDate: invalidDate, districtCode: invalidDistrict } = errors

  function updateValue(event) {
    const { name, value } = event.target
    updateField(name, value)
  }

  function updateField(name, value) {
    setValues(previous => ({ ...previous, [name]: value }))
    if (value && errors[name]) setErrors(previous => ({ ...previous, [name]: false }))
  }

  function changeSpecies(species) {
    setValues(previous => ({ ...previous, species, breed: '' }))
    if (errors.species) setErrors(previous => ({ ...previous, species: false }))
  }

  function changeDate(date) {
    updateField('lostDate', date)
  }

  async function addPhotos(event) {
    const selected = Array.from(event.target.files)
    event.target.value = ''
    const files = selected.filter(file => ['image/jpeg', 'image/png'].includes(file.type) && file.size <= 10 * 1024 * 1024)
    setSubmitError(files.length === selected.length ? '' : '실제 등록에는 10MB 이하의 JPG 또는 PNG 사진을 올려 주세요.')
    const result = await addPreviews(files)
    if (result?.added && invalidPhotos) setErrors(previous => ({ ...previous, photos: false }))
  }

  async function submit(event) {
    event.preventDefault()
    if (submitting) return
    setSubmitError('')
    const missing = {
      photos: photos.length === 0,
      species: !values.species,
      lostDate: !values.lostDate,
      districtCode: !values.provinceCode || !values.districtCode.trim(),
    }
    const firstMissing = Object.keys(missing).find(field => missing[field])
    if (firstMissing) {
      setErrors(missing)
      requestAnimationFrame(() => document.getElementById(FIELD_IDS[firstMissing])?.focus())
      return
    }

    const name = values.name.trim() || '우리 아이'

    setSubmitting(true)
    try {
      const { lostPetId } = await createLostPet({ ...values, name }, photos)
      navigate(candidatesPath(lostPetId))
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    values, photos, missingCount, invalidPhotos, invalidSpecies, invalidDate, invalidDistrict,
    submitting, submitError,
    breeds: breedResult?.species === species ? breedResult.items : [],
    changeRegion: ({ sidoCode, sigungu }) => {
      setValues(previous => ({ ...previous, provinceCode: sidoCode, districtCode: sigungu }))
      if (sigungu.trim()) setErrors(previous => ({ ...previous, districtCode: false }))
    },
    contactInput, updateValue, changeSpecies, changeDate, addPhotos, removePhoto, submit,
  }
}
