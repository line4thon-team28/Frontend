export function formatPetDate(date, short = false) {
  const match = date?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return ''

  const [year, month, day] = match.slice(1).map(Number)
  return short ? `${month}월 ${day}일` : `${year}. ${month}. ${day}`
}

export function formatPetDescription({ species, breed, sex }) {
  return [species, breed, sex].filter(Boolean).join(' · ')
}

export function formatPetAge(age, currentYear = new Date().getFullYear()) {
  if (!age || typeof age !== 'string') return age ?? ''

  // '2026-03-15'처럼 날짜 전체인 경우에만 예외 처리 (공고 날짜 등 오입력 방지)
  if (/^\d{4}[-./]\d{2}[-./]\d{2}$/.test(age.trim())) return age

  // 4자리 연도 추출 (2026, 2026(년생), 2026( 년생 ), 2026-03(년생) 등)
  const match = age.match(/(19\d{2}|20\d{2})/)
  if (!match) return age

  const birthYear = Number(match[1])
  if (Number.isNaN(birthYear)) return age

  const yearsOld = Math.max(0, currentYear - birthYear)
  const isEstimated = /추정/.test(age)

  // 개월 수 정보가 포함되어 있는 경우 (예: 3개월령, 3개월)
  const monthMatch = age.match(/(\d{1,2})\s*개월/)
  if (yearsOld === 0 && monthMatch) {
    return isEstimated ? `${monthMatch[1]}개월(0살, 추정)` : `${monthMatch[1]}개월(0살)`
  }

  return isEstimated ? `${yearsOld}살(추정)` : `${yearsOld}살`
}
