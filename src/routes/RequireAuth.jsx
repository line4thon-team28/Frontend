import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RequireAuth() {
  const { status } = useAuth()

  if (status === 'checking') {
    return null
  }
  if (status !== 'authenticated') {
    return <Navigate to="/start" replace />
  }
  return <Outlet />
}
