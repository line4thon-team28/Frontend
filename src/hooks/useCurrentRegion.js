import { useEffect, useState } from 'react'
import { fetchRegionByCoords } from '../apis/kakaoLocal'

const GEOLOCATION_OPTIONS = { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }

function supportsGeolocation() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

export default function useCurrentRegion() {
  const [state, setState] = useState(() =>
    supportsGeolocation() ? { status: 'locating', region: null } : { status: 'failed', region: null },
  )

  useEffect(() => {
    if (!supportsGeolocation()) return undefined

    let ignore = false
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchRegionByCoords(coords)
          .then((region) => !ignore && setState({ status: 'found', region }))
          .catch(() => !ignore && setState({ status: 'failed', region: null }))
      },
      (error) => {
        if (ignore) return
        setState({ status: error.code === error.PERMISSION_DENIED ? 'denied' : 'failed', region: null })
      },
      GEOLOCATION_OPTIONS,
    )
    return () => {
      ignore = true
    }
  }, [])

  return state
}
