import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import usePawPose from '../mocks/usePawPose'
import { petPaths } from '../routes/petPaths'

export default function useEditRegistrationPage() {
  const { petId } = useParams()
  const navigate = useNavigate()
  const { pets, updatePet } = usePawPose()
  const pet = pets.find((item) => item.id === petId)

  function save(changes) {
    updatePet(pet.id, changes)
    navigate(petPaths.registrations, { replace: true })
  }

  return { pet, save }
}

export function useEditRegistrationForm(pet, onSave) {
  const [features, setFeatures] = useState(pet.features || '')

  function submit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const contact = String(formData.get('contact') ?? '').trim()
    onSave({ features: features.trim(), contact })
  }

  return { features, changeFeatures: (event) => setFeatures(event.target.value), submit }
}
