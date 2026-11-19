export function formatPetDate(date, short = false) {
  const match = date?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return ''

  const [year, month, day] = match.slice(1).map(Number)
  return short ? `${month}월 ${day}일` : `${year}. ${month}. ${day}`
}

export function formatPetDescription({ species, breed, sex }) {
  return [species, breed, sex].filter(Boolean).join(' · ')
}
