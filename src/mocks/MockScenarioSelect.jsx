import useMockScenario from './useMockScenario'
import styles from './MockScenarioSelect.module.css'

export default function MockScenarioSelect({ label, options, onChange, selectRef }) {
  const { scenario, setScenario } = useMockScenario()
  const value = Object.hasOwn(options, scenario) ? scenario : ''

  function changeScenario(event) {
    onChange?.()
    setScenario(event.target.value)
  }

  return (
    <select ref={selectRef} className={styles.select} aria-label={label} value={value} onChange={changeScenario}>
      <option value="">기본 화면</option>
      {Object.entries(options).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
    </select>
  )
}
