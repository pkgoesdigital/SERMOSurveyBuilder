import { useRef, useEffect } from 'react'
import { useSurvey } from '../../contexts/SurveyContext'
import { getTypeDefinition } from '../../question-types/registry'
import EmptyState from '../shared/EmptyState'

export default function Canvas() {
  const { survey, activeQuestionId, updateQuestion } = useSurvey()
  const activeQuestion = survey.questions.find((q) => q.id === activeQuestionId)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [activeQuestion?.text, activeQuestionId])

  if (!activeQuestion) {
    return (
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg)',
        }}
      >
        <EmptyState />
      </main>
    )
  }

  const def = getTypeDefinition(activeQuestion.type)

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: 32,
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 580, width: '100%' }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>
          {def.label}
        </p>
        <textarea
          ref={textareaRef}
          value={activeQuestion.text}
          onChange={(e) => updateQuestion(activeQuestion.id, { text: e.target.value })}
          placeholder="Untitled question"
          rows={1}
          aria-label="Question text"
          style={{
            display: 'block',
            width: '100%',
            marginBottom: 32,
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.3,
            color: 'var(--color-text)',
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid transparent',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            fontFamily: 'inherit',
            padding: '2px 0',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-accent)' }}
          onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'transparent' }}
        />
        <def.RespondentInput
          question={activeQuestion}
          value={null}
          onChange={() => {}}
        />
      </div>
    </main>
  )
}
