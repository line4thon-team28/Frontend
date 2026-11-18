import { useSearchParams } from 'react-router-dom'

export default function useMockScenario() {
  const [params, setParams] = useSearchParams()

  function setScenario(value) {
    const next = new URLSearchParams(params)
    if (value) next.set('scenario', value)
    else next.delete('scenario')
    setParams(next, { replace: true })
  }

  return { params, scenario: params.get('scenario'), setScenario }
}
