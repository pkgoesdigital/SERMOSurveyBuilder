import { useState, useRef } from 'react'
import type { Survey } from '../../lib/types'
import { evaluateBranching, getNextQuestionId } from '../../lib/branching'
import { saveProgress, loadProgress, clearProgress, getSessionToken } from '../../lib/session'
import { storage } from '../../lib/storage'
import { getTypeDefinition } from '../../question-types/registry'
import ProgressBar from '../shared/ProgressBar'
import ThemeToggle from '../shared/ThemeToggle'
import QuestionRenderer from './QuestionRenderer'

interface RespondentViewProps {
  survey: Survey
}

export default function RespondentView({ survey }: RespondentViewProps) {
  const { questions } = survey

  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(() => {
    const restored = loadProgress(survey.id)
    if (restored && questions[restored.currentQuestionIndex]) {
      return questions[restored.currentQuestionIndex].id
    }
    return questions[0]?.id ?? null
  })

  const [answers, setAnswers] = useState<Record<string, string | string[]>>(() => {
    return loadProgress(survey.id)?.answers ?? {}
  })

  // Ref kept in sync with answers so handleAutoAdvance reads the latest value
  // even when called in the same tick as onChange (before state flushes).
  const answersRef = useRef(answers)

  // History stack of visited question IDs — enables branching-aware "Previous".
  // Each advance() pushes the current question; goBack() pops the last one.
  const [history, setHistory] = useState<string[]>([])

  const currentIndex = questions.findIndex((q) => q.id === currentQuestionId)
  const currentQuestion = currentQuestionId
    ? questions.find((q) => q.id === currentQuestionId) ?? null
    : null

  // Use registry to determine if this type auto-advances (no Continue button needed)
  const currentDef = currentQuestion ? getTypeDefinition(currentQuestion.type) : null
  const needsContinue = currentDef ? !currentDef.singleSelection : false

  function advance(fromQuestionId: string, answerId: string) {
    const targeted = evaluateBranching(survey, fromQuestionId, answerId)
    const nextId = targeted ?? getNextQuestionId(survey, fromQuestionId)

    const nextIndex = nextId ? questions.findIndex((q) => q.id === nextId) : questions.length
    saveProgress({ surveyId: survey.id, currentQuestionIndex: nextIndex, answers })

    if (!nextId) {
      clearProgress()
      // Commit the completed response to the database
      const sessionToken = getSessionToken()
      storage.saveResponse({
        id: `${survey.id}_${sessionToken}`,
        surveyId: survey.id,
        sessionToken,
        answers,
        submittedAt: new Date().toISOString(),
      }).catch((err) => console.error('Failed to save survey response:', err))
    }

    // Push current question onto history before advancing
    setHistory((prev) => [...prev, fromQuestionId])
    setCurrentQuestionId(nextId)
  }

  function goBack() {
    if (history.length === 0) return
    const prevId = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))
    // Restore progress index for the previous question
    const prevIndex = questions.findIndex((q) => q.id === prevId)
    saveProgress({ surveyId: survey.id, currentQuestionIndex: prevIndex, answers })
    setCurrentQuestionId(prevId)
  }

  function handleChange(value: string | string[]) {
    if (!currentQuestion) return
    const updated = { ...answers, [currentQuestion.id]: value }
    answersRef.current = updated
    setAnswers(updated)
    saveProgress({
      surveyId: survey.id,
      currentQuestionIndex: currentIndex,
      answers: updated,
    })
  }

  function handleAutoAdvance() {
    if (!currentQuestion) return
    const val = answersRef.current[currentQuestion.id]
    if (val !== undefined) {
      advance(currentQuestion.id, Array.isArray(val) ? val[0] : val)
    }
  }

  function handleContinue() {
    if (!currentQuestion) return
    const val = answers[currentQuestion.id]
    advance(currentQuestion.id, Array.isArray(val) ? val[0] ?? '' : val ?? '')
  }

  const buttonRowStyle: React.CSSProperties = {
    marginTop: 32,
    display: 'flex',
    justifyContent: needsContinue ? 'space-between' : 'flex-start',
    alignItems: 'center',
    gap: 12,
  }

  const previousBtnStyle: React.CSSProperties = {
    minHeight: 44,
    minWidth: 100,
    padding: '0 20px',
    borderRadius: 8,
    border: '1.5px solid var(--color-border)',
    background: 'transparent',
    color: 'var(--color-text-muted)',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
  }

  const continueBtnStyle: React.CSSProperties = {
    minHeight: 44,
    minWidth: 120,
    padding: '0 24px',
    borderRadius: 8,
    border: 'none',
    background: 'var(--color-accent)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: answers[currentQuestion?.id ?? ''] ? 'pointer' : 'not-allowed',
    opacity: answers[currentQuestion?.id ?? ''] ? 1 : 0.5,
  }

  if (!currentQuestion) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--color-text)',
          fontSize: 20,
        }}
      >
        Thank you for completing the survey!
      </div>
    )
  }

  const showPrevious = history.length > 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--color-bg)',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '8px 16px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <ThemeToggle />
      </header>
      <ProgressBar current={Object.keys(answers).length} total={questions.length} />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: 580, width: '100%' }}>
          <h2
            style={{
              fontSize: 22,
              color: 'var(--color-text)',
              marginBottom: 32,
              lineHeight: 1.4,
            }}
          >
            {currentQuestion.text}
          </h2>
          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id] ?? null}
            onChange={handleChange}
            onAutoAdvance={handleAutoAdvance}
          />

          {/* Button row — Previous always available if there's history;
              Continue only shown for multi-selection question types */}
          {(showPrevious || needsContinue) && (
            <div style={buttonRowStyle}>
              {showPrevious && (
                <button onClick={goBack} style={previousBtnStyle} aria-label="Go to previous question">
                  ← Previous
                </button>
              )}
              {needsContinue && (
                <button
                  onClick={handleContinue}
                  disabled={!answers[currentQuestion.id]}
                  style={continueBtnStyle}
                  aria-label="Continue to next question"
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
