import { toDateInputValue } from './date'

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
