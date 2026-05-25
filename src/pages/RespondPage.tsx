import { useParams } from 'react-router-dom'
import RespondentView from '../components/respondent/RespondentView'
import { ThemeProvider } from '../contexts/ThemeContext'
import type { Survey } from '../lib/types'
import { generateId } from '../lib/utils'

// Placeholder survey until storage layer is wired up
function makePlaceholderSurvey(id: string): Survey {
  return {
    id,
    title: 'Survey',
    questions: [],
    branchingRules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export default function RespondPage() {
  const { surveyId } = useParams<{ surveyId: string }>()
  const survey = makePlaceholderSurvey(surveyId ?? generateId())

  return (
    <ThemeProvider>
      <div style={{ height: '100vh' }}>
        <RespondentView survey={survey} />
      </div>
    </ThemeProvider>
  )
}
