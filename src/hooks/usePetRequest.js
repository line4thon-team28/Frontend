import { useCallback, useEffect, useState } from 'react'

export default function usePetRequest(loader, enabled = true) {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!enabled) return
    let active = true
    loader()
      .then(data => { if (active) setResult({ loader, version, data }) })
      .catch(error => { if (active) setResult({ loader, version, error }) })
    return () => { active = false }
  }, [enabled, loader, version])

  const current = enabled && result?.loader === loader && result?.version === version ? result : null
  const reload = useCallback(() => setVersion(value => value + 1), [])
  const previous = enabled && result?.loader === loader ? result.data : undefined
  return { data: current ? current.data : previous, error: current?.error, loading: enabled && !current, reload }
}
