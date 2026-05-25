import { useSurvey } from '../../contexts/SurveyContext'

export default function SurveyTitleInput() {
  const { survey, setSurveyTitle } = useSurvey()

  return (
    <input
      aria-label="Survey title"
      value={survey.title}
      onChange={(e) => setSurveyTitle(e.target.value)}
      style={{
        fontSize: 15,
        fontWeight: 600,
        background: 'transparent',
        border: 'none',
        color: 'var(--color-text)',
        outline: 'none',
        minWidth: 200,
      }}
    />
  )
}
