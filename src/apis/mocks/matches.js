import petA from '../../assets/images/pet-a.webp'
import petB from '../../assets/images/pet-b.webp'
import petD from '../../assets/images/pet-d.webp'
import petF from '../../assets/images/pet-f.webp'
import petG from '../../assets/images/pet-g.webp'
import { ApiError } from '../client'
import { findMockLostPet } from './lostPets'

const RETRY_AFTER_SECONDS = 10

const PROCESSING_MESSAGES = {
  PENDING: '사진 분석 중이에요',
  PROCESSING: '사진 분석 중이에요',
  FAILED: '사진 분석에 실패했어요. 잠시 후 다시 비교할게요',
  PARTIAL: '일부 후보 사진을 분석하지 못했어요. 확인된 후보부터 보여드릴게요',
  NOT_REQUESTED: '매칭에 필요한 등록 정보를 기다리고 있어요',
  CANCELLED: '찾음 처리되어 새로운 비교를 중단했어요',
  READY: null,
}

function createCandidates(lostPetId) {
  const base = lostPetId * 100
  return [
    {
      matchId: base + 1,
      type: 'NOTICE',
      noticeId: base + 11,
      sightingId: null,
      imageUrl: petF,
      similarity: 0.924,
      shelterName: '강북구 동물보호센터',
      place: '강북구 수유동',
      occurredOn: '2026-11-07',
      noticeEndDate: '2026-11-26',
      daysLeft: 7,
      urgent: false,
      feedback: 'NONE',
    },
    {
      matchId: base + 2,
      type: 'SIGHTING',
      noticeId: null,
      sightingId: base + 21,
      imageUrl: petG,
      similarity: 0.781,
      shelterName: null,
      place: '성북구 정릉동',
      occurredOn: '2026-11-19',
      noticeEndDate: null,
      daysLeft: null,
      urgent: false,
      feedback: 'NONE',
    },
    {
      matchId: base + 3,
      type: 'NOTICE',
      noticeId: base + 13,
      sightingId: null,
      imageUrl: petD,
      similarity: 0.713,
      shelterName: '동대문구 동물보호센터',
      place: '동대문구 장안동',
      occurredOn: '2026-11-06',
      noticeEndDate: '2026-11-21',
      daysLeft: 2,
      urgent: true,
      feedback: 'NONE',
    },
    {
      matchId: base + 4,
      type: 'NOTICE',
      noticeId: base + 14,
      sightingId: null,
      imageUrl: petB,
      similarity: 0.648,
      shelterName: '노원구 동물보호센터',
      place: '노원구 공릉동',
      occurredOn: '2026-11-08',
      noticeEndDate: '2026-11-29',
      daysLeft: 10,
      urgent: false,
      feedback: 'NONE',
    },
    {
      matchId: base + 5,
      type: 'NOTICE',
      noticeId: base + 15,
      sightingId: null,
      imageUrl: petA,
      similarity: 0.612,
      shelterName: '중랑구 동물보호센터',
      place: '중랑구 면목동',
      occurredOn: '2026-11-09',
      noticeEndDate: '2026-12-01',
      daysLeft: 12,
      urgent: false,
      feedback: 'NONE',
    },
  ]
}

const candidatesByLostPet = new Map()

function getCandidates(lostPetId) {
  if (!candidatesByLostPet.has(lostPetId)) {
    candidatesByLostPet.set(lostPetId, createCandidates(lostPetId))
  }
  return candidatesByLostPet.get(lostPetId)
}

function findLostPetOrThrow(lostPetId) {
  const lostPet = findMockLostPet(lostPetId)
  if (!lostPet) {
    throw new ApiError('실종 등록을 찾을 수 없어요', 'LOST_PET_NOT_FOUND', 404)
  }
  return lostPet
}

function currentStatus(matching) {
  if ((matching.status === 'PROCESSING' || matching.status === 'PENDING') && Date.now() >= matching.readyAt) {
    matching.status = 'READY'
  }
  return matching.status
}

function compareCandidates(sort) {
  return (a, b) => {
    if (a.feedback === 'YES' && b.feedback !== 'YES') return -1
    if (b.feedback === 'YES' && a.feedback !== 'YES') return 1
    if (sort === 'deadline') {
      if (a.daysLeft === null && b.daysLeft !== null) return 1
      if (b.daysLeft === null && a.daysLeft !== null) return -1
      if (a.daysLeft !== b.daysLeft) return a.daysLeft - b.daysLeft
    }
    return b.similarity - a.similarity || a.matchId - b.matchId
  }
}

export function getMockMatches(lostPetId, { sort, page, size }) {
  const lostPet = findLostPetOrThrow(lostPetId)
  const status = currentStatus(lostPet.matching)
  const hasResult = status === 'READY' || status === 'PARTIAL' || status === 'CANCELLED'
  const visible = hasResult
    ? getCandidates(lostPet.lostPetId)
        .filter((candidate) => candidate.feedback !== 'NO')
        .sort(compareCandidates(sort))
    : []

  return {
    items: visible.slice(page * size, page * size + size).map((candidate) => ({ ...candidate })),
    page,
    size,
    totalCount: visible.length,
    processingStatus: status,
    processingMessage: PROCESSING_MESSAGES[status],
    failureCode: status === 'FAILED' ? 'EMBEDDING_FAILED' : null,
    retryAfterSeconds: hasResult || status === 'FAILED' ? null : RETRY_AFTER_SECONDS,
    scoreIsProbability: false,
    pendingTargetCount: 0,
    failedTargetCount: status === 'PARTIAL' ? 3 : 0,
  }
}

export function retryMockMatching(lostPetId) {
  const lostPet = findLostPetOrThrow(lostPetId)
  if (lostPet.matching.status === 'CANCELLED') {
    throw new ApiError('찾음 처리된 등록은 비교를 중단했어요', 'MATCHING_STOPPED', 409)
  }
  lostPet.matching = { status: 'PROCESSING', readyAt: Date.now() + RETRY_AFTER_SECONDS * 1000 }
  return null
}

export function setMockFeedback(matchId, result) {
  for (const candidates of candidatesByLostPet.values()) {
    const candidate = candidates.find((item) => item.matchId === Number(matchId))
    if (candidate) {
      candidate.feedback = result.toUpperCase()
      return { matchId: candidate.matchId, feedback: candidate.feedback }
    }
  }
  throw new ApiError('후보를 찾을 수 없어요', 'MATCH_NOT_FOUND', 404)
}
