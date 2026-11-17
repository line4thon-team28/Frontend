import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe } from '../api/auth'
import { setTokenExpiredHandler } from '../api/client'
import { clearAccessToken, getAccessToken, saveAccessToken } from '../api/tokenStorage'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(() => (getAccessToken() ? 'checking' : 'guest'))

  const signOut = useCallback(() => {
    clearAccessToken()
    setUser(null)
    setStatus('guest')
  }, [])

  const signIn = useCallback(async (accessToken) => {
    saveAccessToken(accessToken)
    const me = await fetchMe()
    setUser(me)
    setStatus('authenticated')
    return me
  }, [])

  useEffect(() => {
    setTokenExpiredHandler(() => {
      signOut()
      const { pathname, search } = window.location
      navigate('/login', { state: { reason: 'expired', from: `${pathname}${search}` } })
    })
  }, [navigate, signOut])

  useEffect(() => {
    if (!getAccessToken()) {
      return
    }

    let ignore = false
    fetchMe()
      .then((me) => {
        if (ignore) return
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => {
        if (ignore) return
        clearAccessToken()
        setStatus('guest')
      })

    return () => {
      ignore = true
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      signIn,
      signOut,
    }),
    [user, status, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
