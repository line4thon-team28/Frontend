const MOCK_RETRY_SECONDS = 2
const pollCounts = new Map()
let nextSightingId = 1

function pendingResult(sightingId) {
  return {
    sightingId,
    matchedCount: 0,
    processingStatus: 'PENDING',
    processingMessage: '사진 분석 및 실종 등록 비교 중이에요',
    failureCode: null,
    retryAfterSeconds: MOCK_RETRY_SECONDS,
  }
}

export function createMockSighting(formData) {
  if (formData.getAll('photos').length === 0) {
    throw new Error('MOCK_PHOTOS_REQUIRED')
  }
  const sightingId = nextSightingId
  nextSightingId += 1
  pollCounts.set(sightingId, 0)
  return { ...pendingResult(sightingId), processingMessage: '사진 분석 중이에요' }
}

export function getMockSightingResult(sightingId) {
  const polls = (pollCounts.get(sightingId) ?? 0) + 1
  pollCounts.set(sightingId, polls)
  if (polls < 2) {
    return pendingResult(sightingId)
  }
  return {
    sightingId,
    matchedCount: 1,
    processingStatus: 'READY',
    processingMessage: '비슷한 실종 등록을 찾았어요',
    failureCode: null,
    retryAfterSeconds: null,
  }
}
