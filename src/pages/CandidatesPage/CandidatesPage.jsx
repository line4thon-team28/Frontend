import MockScenarioSelect from '../../mocks/MockScenarioSelect'
import CandidateResults from '../../components/CandidateResults/CandidateResults'
import useCandidatesPage, { PREVIEW_OPTIONS } from '../../hooks/useCandidatesPage'

export default function CandidatesPage() {
  const { pet, candidates, scenario, feedback, setFeedback, markFound, requestPreviewFocus, focusPreview } = useCandidatesPage()

  return (
    <CandidateResults
      key={`${pet?.id ?? ''}:${scenario}`}
      pet={pet}
      candidates={candidates}
      scenario={scenario}
      feedback={feedback}
      setFeedback={setFeedback}
      markFound={markFound}
      previewControl={(
        <MockScenarioSelect
          label="후보 화면 미리보기"
          options={PREVIEW_OPTIONS}
          onChange={requestPreviewFocus}
          selectRef={focusPreview}
        />
      )}
    />
  )
}
