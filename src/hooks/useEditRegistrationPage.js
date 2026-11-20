import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPet, updatePet } from '../apis/pets'
import usePetRequest from './usePetRequest'
import { petPaths } from '../routes/petPaths'

export default function useEditRegistrationPage() {
  const { petId } = useParams()
  const navigate = useNavigate()
  const load = useCallback(() => fetchPet(petId), [petId])
  const live = usePetRequest(load)
  const pet = live.data
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function save(changes) {
    if (saving) return
    setSaving(true)
    setSaveError('')
    try {
      await updatePet(pet.id, changes)
      navigate(petPaths.registrations, { replace: true })
    } catch (error) {
      setSaveError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return { pet, save, saving, saveError, loading: live.loading, error: live.error, retry: live.reload }
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
