const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

function pad(value) {
  return String(value).padStart(2, '0')
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function toLocalDateTimeValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`
}

export function formatClock(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function getDayGroup(dateTime, now = new Date()) {
  const date = new Date(dateTime)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (isSameDay(date, now)) return '오늘'
  if (isSameDay(date, yesterday)) return '어제'
  return '이전'
}

export function formatRelativeTime(dateTime, now = new Date()) {
  const date = new Date(dateTime)
  const elapsed = now - date
  if (elapsed < MINUTE) return '방금 전'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}분 전`

  const group = getDayGroup(date, now)
  if (group === '오늘') return `${Math.floor(elapsed / HOUR)}시간 전`
  if (group === '어제') return '어제'
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

export function formatDayAndClock(date, now = new Date()) {
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (isSameDay(date, now)) {
    return `오늘 ${formatClock(date)}`
  }
  if (isSameDay(date, yesterday)) {
    return `어제 ${formatClock(date)}`
  }
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${formatClock(date)}`
}
