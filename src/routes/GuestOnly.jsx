import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function GuestOnly() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return null
  }
  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? '/home'} replace />
  }
  return <Outlet />
}
