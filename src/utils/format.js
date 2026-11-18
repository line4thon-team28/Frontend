import { toDateInputValue } from './date'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

export function formatSimilarity(similarity) {
  const percent = Math.floor(similarity * 1000) / 10
  return `${Number.isInteger(percent) ? percent : percent.toFixed(1)}%`
}

export function formatMonthDay(dateString) {
  if (!dateString) return ''
  if (dateString === toDateInputValue(new Date())) return '오늘'
  const [, month, day] = dateString.split('-').map(Number)
  return `${month}월 ${day}일`
}

export function getDayGroup(dateTime, now = new Date()) {
  const date = toDateInputValue(new Date(dateTime))
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  if (date === toDateInputValue(now)) return '오늘'
  if (date === toDateInputValue(yesterday)) return '어제'
  return '이전'
}

export function formatRelativeTime(dateTime, now = new Date()) {
  const elapsed = now - new Date(dateTime)
  if (elapsed < MINUTE) return '방금 전'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}분 전`

  const group = getDayGroup(dateTime, now)
  if (group === '오늘') return `${Math.floor(elapsed / HOUR)}시간 전`
  if (group === '어제') return '어제'
  return formatMonthDay(toDateInputValue(new Date(dateTime)))
}

export function formatDayAndTime(dateTime) {
  const date = new Date(dateTime)
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  return `${formatMonthDay(toDateInputValue(date))} ${time}`
}

export function withParticle(word, withBatchim, withoutBatchim) {
  const lastCode = word.charCodeAt(word.length - 1) - 0xac00
  const hasBatchim = lastCode >= 0 && lastCode <= 11171 && lastCode % 28 !== 0
  return `${word}${hasBatchim ? withBatchim : withoutBatchim}`
}
