import useLiveCandidates from '../../hooks/useLiveCandidates'
import CandidateResults from '../../components/CandidateResults/CandidateResults'

export default function CandidatesPage() {
  const model = useLiveCandidates()
  return <CandidateResults pet={model.pet} model={model} />
}
