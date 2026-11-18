import LostRegistrationForm from '../../components/LostRegistrationForm/LostRegistrationForm'
import useMockScenario from '../../mocks/useMockScenario'

export default function LostRegistrationPage() {
  const { scenario } = useMockScenario()
  return <LostRegistrationForm key={scenario} scenario={scenario} />
}
