import { createContext, useContext } from 'react'

export const PawPoseContext = createContext(null)

export default function usePawPose() {
  return useContext(PawPoseContext)
}

export function selectCandidatePet(pets, requestedPetId) {
  return pets.find(({ id }) => id === requestedPetId)
    ?? pets.find(({ status }) => status === 'searching')
    ?? pets[0]
}
