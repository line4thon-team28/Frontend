import { useEffect } from 'react'
import { LAST_CANDIDATE_PET_KEY } from '../constants/storageKeys'

function readLastPetId(key) {
  if (!key) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export default function useCandidateListPet(pets, selectedPet, scope) {
  const key = scope ? `${LAST_CANDIDATE_PET_KEY}.${scope}` : null
  const lastPetId = !selectedPet && pets ? readLastPetId(key) : null
  const pet = selectedPet
    ?? pets?.find(({ id }) => id === lastPetId)
    ?? pets?.find(({ status }) => status === 'searching')
    ?? pets?.[0]
  const petId = pet?.id

  useEffect(() => {
    if (!key || !petId) return
    try {
      localStorage.setItem(key, petId)
    } catch {
      // Candidate lists still work when storage is unavailable.
    }
  }, [key, petId])

  return pet
}
