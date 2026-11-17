import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe } from '../../apis/auth'
import { setTokenExpiredHandler } from '../../apis/client'
import { AuthContext } from '../../hooks/authContext'
import { clearAccessToken, getAccessToken, saveAccessToken } from '../../utils/tokenStorage'

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
      .catch((error) => {
        if (ignore) return
        if (error.status === 401) {
          clearAccessToken()
          setStatus('guest')
          return
        }
        setStatus('authenticated')
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
