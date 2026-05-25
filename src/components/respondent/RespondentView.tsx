import { useState } from 'react'
import type { Survey } from '../../lib/types'
import { evaluateBranching, getNextQuestionId } from '../../lib/branching'
import { saveProgress, loadProgress, clearProgress } from '../../lib/session'
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

  const currentIndex = questions.findIndex((q) => q.id === currentQuestionId)
  const currentQuestion = currentQuestionId
    ? questions.find((q) => q.id === currentQuestionId) ?? null
    : null

  function advance(fromQuestionId: string, answerId: string) {
    const targeted = evaluateBranching(survey, fromQuestionId, answerId)
    const nextId = targeted ?? getNextQuestionId(survey, fromQuestionId)

    const nextIndex = nextId ? questions.findIndex((q) => q.id === nextId) : questions.length
    saveProgress({ surveyId: survey.id, currentQuestionIndex: nextIndex, answers })

    if (!nextId) {
      clearProgress()
    }
    setCurrentQuestionId(nextId)
  }

  function handleChange(value: string | string[]) {
    if (!currentQuestion) return
    const updated = { ...answers, [currentQuestion.id]: value }
    setAnswers(updated)
    saveProgress({
      surveyId: survey.id,
      currentQuestionIndex: currentIndex,
      answers: updated,
    })
  }

  function handleAutoAdvance() {
    if (!currentQuestion) return
    const val = answers[currentQuestion.id]
    if (val !== undefined) {
      advance(currentQuestion.id, Array.isArray(val) ? val[0] : val)
    }
  }

  function handleContinue() {
    if (!currentQuestion) return
    const val = answers[currentQuestion.id]
    advance(currentQuestion.id, Array.isArray(val) ? val[0] ?? '' : val ?? '')
  }

  const needsContinue =
    currentQuestion?.type === 'multi-select' ||
    currentQuestion?.type === 'grid' ||
    currentQuestion?.type === 'numeric'

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
          {needsContinue && (
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleContinue}
                disabled={!answers[currentQuestion.id]}
                style={{
                  minHeight: 44,
                  minWidth: 120,
                  padding: '0 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: answers[currentQuestion.id] ? 'pointer' : 'not-allowed',
                  opacity: answers[currentQuestion.id] ? 1 : 0.5,
                }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
