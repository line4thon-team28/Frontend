import { useState } from 'react'
import { fetchPets, updatePet } from '../apis/pets'
import usePetRequest from './usePetRequest'
import useAuth from './useAuth'

export default function useMyRegistrationsPage() {
  const live = usePetRequest(fetchPets)
  const [action, setAction] = useState(null)
  const pets = live.data ?? []

  async function markFound(id) {
    if (action?.busy) return
    setAction({ busy: true })
    try {
      await updatePet(id, { status: 'FOUND' })
      live.reload()
      setAction(null)
    } catch (error) {
      setAction({ error: error.message })
    }
  }
  const { user } = useAuth()
  const loading = live.loading
  const error = live.error
  const empty = pets.length === 0
  const nickname = user?.nickname || ''
  const searchingPets = pets.filter((pet) => pet.status !== 'found')
  const foundPets = pets.filter((pet) => pet.status === 'found')

  return {
    markFound, loading, error, empty, nickname, searchingPets, foundPets,
    retry: live.reload,
    actionError: action?.error, busy: action?.busy,
  }
}
