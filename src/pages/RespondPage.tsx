import { useSearchParams } from 'react-router-dom'
import RespondentView from '../components/respondent/RespondentView'
import { ThemeProvider } from '../contexts/ThemeContext'
import { decodeSurveyFromShare } from '../lib/export'
import type { Survey } from '../lib/types'

function ShareLinkError({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 24,
        textAlign: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>This survey link can&apos;t be opened</h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', maxWidth: 420 }}>
        {message}
      </p>
    </div>
  )
}

export default function RespondPage() {
  const [params] = useSearchParams()
  const encoded = params.get('survey')

  let survey: Survey | null = null
  let errorMessage: string | null = null

  if (encoded) {
    survey = decodeSurveyFromShare(encoded)
    if (!survey) errorMessage = 'The share link appears to be corrupted or incomplete.'
  } else {
    errorMessage = 'No survey was provided in the link. Ask the survey author to share again.'
  }

  return (
    <ThemeProvider>
      <div style={{ height: '100vh' }}>
        {survey ? <RespondentView survey={survey} /> : <ShareLinkError message={errorMessage ?? ''} />}
      </div>
    </ThemeProvider>
  )
}
