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
