import { request } from './client'

export const speciesCodes = { 개: 'DOG', 고양이: 'CAT', 기타: 'ETC' }
const sexCodes = { 수컷: 'MALE', 암컷: 'FEMALE' }
const feedbackCodes = { match: 'yes', hidden: 'no' }
const labels = { DOG: '개', CAT: '고양이', ETC: '기타', MALE: '수컷', FEMALE: '암컷', UNKNOWN: '모름' }

export function imageUrl(url) {
  return url?.startsWith('/') ? (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '') + url : url
}

export function createLostPet(values, photos) {
  const body = new FormData()
  for (const { file } of photos) body.append('photos', file)
  const fields = {
    name: values.name, species: speciesCodes[values.species], breed: values.breed,
    sex: sexCodes[values.sex], color: values.coat, lostDate: values.lostDate,
    sido: values.provinceCode, sigungu: values.districtCode.trim(), place: values.place?.trim(),
    features: values.features.trim(), phone: values.contact.trim(),
  }
  for (const [key, value] of Object.entries(fields)) if (value) body.append(key, value)
  return request('/lost-pets', { method: 'POST', body })
}

export function toPet(data) {
  return {
    ...data, id: String(data.lostPetId), species: labels[data.species], sex: labels[data.sex],
    coat: data.color, city: data.sidoName, district: data.sigungu, contact: data.phone,
    photo: imageUrl(data.thumbnail), photoCount: data.photos?.length ?? 0, status: data.status?.toLowerCase(),
  }
}

export async function fetchPets() {
  return (await request('/lost-pets/me')).map(toPet)
}

export async function fetchPet(id) {
  return toPet(await request(`/lost-pets/${encodeURIComponent(id)}`))
}

export function updatePet(id, { features, contact, status }) {
  return request(`/lost-pets/${encodeURIComponent(id)}`, { method: 'PATCH', body: { features, phone: contact, status } })
}

export function fetchBreeds(species) {
  return request(`/breeds?${new URLSearchParams({ species: speciesCodes[species] })}`)
}

export function fetchMatches(id, sort) {
  return request(`/lost-pets/${encodeURIComponent(id)}/matches?${new URLSearchParams({ sort, page: 0, size: 20 })}`)
}

export function retryMatches(id) {
  return request(`/lost-pets/${encodeURIComponent(id)}/matches/retry`, { method: 'POST' })
}

export function saveFeedback(id, choice) {
  return request(`/matches/${encodeURIComponent(id)}/feedback`, { method: 'POST', body: { result: feedbackCodes[choice] ?? 'none' } })
}

export function fetchNotice(id) {
  return request(`/notices/${encodeURIComponent(id)}`)
}

export function toCandidate(row) {
  const sighting = row.type === 'SIGHTING'
  return {
    ...row, id: String(row.matchId), type: sighting ? 'sighting' : 'shelter',
    title: sighting ? '목격 제보' : row.shelterName || '보호소 공고',
    photo: imageUrl(row.imageUrl), score: row.similarity, location: row.place,
    reportedAt: row.occurredOn, deadlineDays: row.daysLeft,
    note: sighting && typeof row.memo === 'string' ? row.memo.trim() : undefined,
  }
}
