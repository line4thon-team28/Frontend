import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import samplePhoto from '../assets/images/pet-a.webp'
import legalDongRegions from '../data/legal-dong-regions.json'
import usePawPose from '../mocks/usePawPose'
import { candidatesPath } from '../routes/petPaths'

export const PHOTO_LIMIT = 5
export const BREEDS = {
  개: ['믹스', '푸들', '포메라니안', '말티즈', '시바견', '진돗개'],
  고양이: ['코리안 숏헤어', '러시안 블루', '샴', '페르시안', '믹스'],
  기타: [],
}
const { provinces, districtsByProvinceCode } = legalDongRegions
const EMPTY_FORM = {
  species: '고양이', breed: '', sex: '', coat: '', lostDate: '',
  provinceCode: '1100000000', districtCode: '', features: '', contact: '',
}
const CONTACT_PREVIEW = {
  ...EMPTY_FORM,
  breed: '코리안 숏헤어', sex: '암컷', coat: '치즈', lostDate: '2026-11-05',
  districtCode: '1129000000', features: '치즈 태비, 빨간 목줄, 왼쪽 귀 끝 살짝 접힘', contact: '010-1234-5678',
}
export const FIELD_IDS = { photos: 'lost-photo', lostDate: 'lost-date', districtCode: 'lost-district' }
const PREVIEW_ERRORS = { photos: true, lostDate: true, districtCode: true }

export default function useLostRegistrationForm(scenario) {
  const navigate = useNavigate()
  const { registerPet } = usePawPose()
  const [values, setValues] = useState(() => scenario === 'contact' ? CONTACT_PREVIEW : EMPTY_FORM)
  const [photos, setPhotos] = useState(() => scenario === 'contact' ? [{ url: samplePhoto, name: '예시 사진' }] : [])
  const [errors, setErrors] = useState(() => scenario === 'error' ? PREVIEW_ERRORS : {})
  const contactInput = useRef(null)
  const previewUrls = useRef(new Set())

  useEffect(() => {
    const urls = previewUrls.current
    return () => {
      for (const url of urls) URL.revokeObjectURL(url)
    }
  }, [])

  useEffect(() => {
    if (scenario === 'contact') contactInput.current?.focus()
  }, [scenario])

  const missingCount = Object.values(errors).filter(Boolean).length
  const { photos: invalidPhotos, lostDate: invalidDate, districtCode: invalidDistrict } = errors
  const province = provinces.find(({ code }) => code === values.provinceCode)
  const districts = districtsByProvinceCode[values.provinceCode] ?? []
  const district = districts.find(({ code }) => code === values.districtCode)
  const needsDistrict = districts.length > 0

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
  }

  function changeDate(date) {
    updateField('lostDate', date)
  }

  function changeProvince(event) {
    const provinceCode = event.target.value
    setValues(previous => ({ ...previous, provinceCode, districtCode: '' }))
    if (!districtsByProvinceCode[provinceCode]?.length && invalidDistrict) {
      setErrors(previous => ({ ...previous, districtCode: false }))
    }
  }

  function addPhotos(event) {
    const files = Array.from(event.target.files).filter(file => file.type.startsWith('image/'))
    const added = files.slice(0, PHOTO_LIMIT - photos.length).map(file => {
      const url = URL.createObjectURL(file)
      previewUrls.current.add(url)
      return { url, name: file.name }
    })

    setPhotos([...photos, ...added])
    if (added.length > 0 && invalidPhotos) setErrors(previous => ({ ...previous, photos: false }))
    event.target.value = ''
  }

  function removePhoto(url) {
    if (previewUrls.current.delete(url)) URL.revokeObjectURL(url)
    setPhotos(photos.filter(photo => photo.url !== url))
  }

  function submit(event) {
    event.preventDefault()
    const missing = {
      photos: photos.length === 0,
      lostDate: !values.lostDate,
      districtCode: !province || (needsDistrict && !district),
    }
    const firstMissing = Object.keys(missing).find(field => missing[field])
    if (firstMissing) {
      setErrors(missing)
      requestAnimationFrame(() => document.getElementById(FIELD_IDS[firstMissing])?.focus())
      return
    }

    const photo = photos[0].url
    const pet = registerPet({
      ...values, city: province.name, district: district?.name ?? '',
      name: '우리 아이', photo, photoCount: photos.length,
    })
    previewUrls.current.delete(photo)
    navigate(candidatesPath(pet.id))
  }

  return {
    values, photos, missingCount, invalidPhotos, invalidDate, invalidDistrict, provinces, districts, needsDistrict,
    contactInput, updateValue, changeSpecies, changeDate, changeProvince, addPhotos, removePhoto, submit,
  }
}
