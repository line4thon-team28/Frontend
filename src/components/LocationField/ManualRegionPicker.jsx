import { useEffect, useState } from 'react'
import { fetchDistricts, fetchProvinces } from '../../apis/regions'
import SelectBox from '../SelectBox/SelectBox'
import styles from './LocationField.module.css'

export default function ManualRegionPicker({ value, onChange }) {
  const [provinceToken, setProvinceToken] = useState(0)
  const [provinceResult, setProvinceResult] = useState(null)
  const [districtToken, setDistrictToken] = useState(0)
  const [districtResult, setDistrictResult] = useState(null)
  const districtKey = `${value.sidoCode}:${districtToken}`

  useEffect(() => {
    let ignore = false
    fetchProvinces()
      .then((provinces) => !ignore && setProvinceResult({ token: provinceToken, provinces }))
      .catch(() => !ignore && setProvinceResult({ token: provinceToken, failed: true }))
    return () => {
      ignore = true
    }
  }, [provinceToken])

  useEffect(() => {
    if (!value.sidoCode) return undefined
    let ignore = false
    fetchDistricts(value.sidoCode)
      .then((data) => !ignore && setDistrictResult({ key: districtKey, ...data }))
      .catch(() => !ignore && setDistrictResult({ key: districtKey, failed: true }))
    return () => {
      ignore = true
    }
  }, [value.sidoCode, districtKey])

  const isProvinceLoading = provinceResult?.token !== provinceToken
  const provinces = isProvinceLoading ? [] : (provinceResult.provinces ?? [])
  const isDistrictLoading = Boolean(value.sidoCode) && districtResult?.key !== districtKey
  const districts = !value.sidoCode || isDistrictLoading ? null : districtResult

  const handleProvinceChange = (event) => {
    onChange({ sidoCode: event.target.value, sigungu: '' })
  }

  const handleDistrictChange = (event) => {
    onChange({ ...value, sigungu: event.target.value })
  }

  if (!isProvinceLoading && provinceResult.failed) {
    return (
      <div className={styles.loadError} role="alert">
        지역 목록을 불러오지 못했어요.
        <button type="button" className={styles.textButton} onClick={() => setProvinceToken((token) => token + 1)}>
          다시 시도
        </button>
      </div>
    )
  }

  const renderDistrict = () => {
    if (districts?.failed) {
      return (
        <div className={`${styles.loadError} ${styles.districtError}`} role="alert">
          불러오지 못했어요.
          <button type="button" className={styles.textButton} onClick={() => setDistrictToken((token) => token + 1)}>
            다시 시도
          </button>
        </div>
      )
    }
    if (districts?.isManual) {
      return (
        <input
          className={styles.districtInput}
          value={value.sigungu}
          onChange={handleDistrictChange}
          placeholder="시군구 입력"
          maxLength={100}
          aria-label="시군구"
        />
      )
    }
    return (
      <SelectBox
        aria-label="시군구"
        value={value.sigungu}
        onChange={handleDistrictChange}
        placeholder={isDistrictLoading ? '불러오는 중' : '시군구 선택'}
        disabled={!districts}
        options={(districts?.districts ?? []).map(({ name }) => ({ value: name, label: name }))}
      />
    )
  }

  return (
    <div className={styles.pickers}>
      <SelectBox
        aria-label="시도"
        value={value.sidoCode}
        onChange={handleProvinceChange}
        placeholder={isProvinceLoading ? '불러오는 중' : '시도 선택'}
        disabled={isProvinceLoading}
        options={provinces.map(({ sidoCode, name }) => ({ value: sidoCode, label: name }))}
      />
      {renderDistrict()}
    </div>
  )
}
