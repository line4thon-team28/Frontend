import { useState } from 'react'
import { candidates, initialPets } from './pawPoseFixtures'
import { PawPoseContext } from './usePawPose'

function today() {
  const date = new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export default function PawPoseMockProvider({ children }) {
  const [pets, setPets] = useState(initialPets)
  const [feedback, setFeedbackByPet] = useState({})

  function registerPet(data) {
    const pet = { ...data, id: crypto.randomUUID(), status: 'searching', foundDate: null }
    setPets((previous) => [pet, ...previous])
    return pet
  }

  function updatePet(id, { features, contact }) {
    setPets((previous) => previous.map((pet) => pet.id === id ? { ...pet, features, contact } : pet))
  }

  function markFound(id) {
    const foundDate = today()
    setPets((previous) => previous.map((pet) => (
      pet.id === id && pet.status !== 'found' ? { ...pet, status: 'found', foundDate } : pet
    )))
  }

  function setFeedback(petId, candidateId, value) {
    setFeedbackByPet((previous) => {
      const petFeedback = { ...previous[petId] }
      delete petFeedback[candidateId]
      if (value) petFeedback[candidateId] = value
      return { ...previous, [petId]: petFeedback }
    })
  }

  return (
    <PawPoseContext.Provider value={{ pets, candidates, feedback, registerPet, updatePet, markFound, setFeedback }}>
      {children}
    </PawPoseContext.Provider>
  )
}
