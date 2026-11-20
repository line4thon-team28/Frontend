import { startTransition, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPets, updatePet } from '../apis/pets'
import usePetRequest from './usePetRequest'
import useAuth from './useAuth'

export default function useMyRegistrationsPage() {
  const navigate = useNavigate()
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
  const { user, signOut } = useAuth()
  const loading = live.loading
  const error = live.error
  const empty = pets.length === 0
  const nickname = user?.nickname || ''
  const searchingPets = pets.filter((pet) => pet.status !== 'found')
  const foundPets = pets.filter((pet) => pet.status === 'found')

  function logout() {
    if (!window.confirm('로그아웃하시겠어요?')) return
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('pawpose.')) {
          localStorage.removeItem(key)
        }
      })
    } catch {
      // storage unavailable
    }
    startTransition(() => {
      navigate('/start', { replace: true })
      signOut()
    })
  }

  return {
    markFound, logout, loading, error, empty, nickname, searchingPets, foundPets,
    retry: live.reload,
    actionError: action?.error, busy: action?.busy,
  }
}
