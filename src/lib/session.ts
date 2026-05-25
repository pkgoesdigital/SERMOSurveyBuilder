const SESSION_KEY = 'sermo_session_token'
const PROGRESS_KEY = 'sermo_survey_progress'

export const getSessionToken = (): string => {
  const existing = sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const token = crypto.randomUUID()
  sessionStorage.setItem(SESSION_KEY, token)
  return token
}

export type SurveyProgress = {
  surveyId: string
  currentQuestionIndex: number
  answers: Record<string, string | string[]>
}

export const saveProgress = (progress: SurveyProgress): void => {
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export const loadProgress = (surveyId: string): SurveyProgress | null => {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY)
    if (!raw) return null
    const progress: SurveyProgress = JSON.parse(raw)
    return progress.surveyId === surveyId ? progress : null
  } catch {
    return null
  }
}

export const clearProgress = (): void => {
  sessionStorage.removeItem(PROGRESS_KEY)
}
