import { useSurvey } from '../../contexts/SurveyContext'
import { getTypeDefinition } from '../../question-types/registry'
import EmptyState from '../shared/EmptyState'

export default function Canvas() {
  const { survey, activeQuestionId } = useSurvey()
  const activeQuestion = survey.questions.find((q) => q.id === activeQuestionId)

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
        <h2 style={{ fontSize: 24, color: 'var(--color-text)', marginBottom: 32 }}>
          {activeQuestion.text || <em style={{ opacity: 0.5 }}>Untitled question</em>}
        </h2>
        <def.RespondentInput
          question={activeQuestion}
          value={null}
          onChange={() => {}}
        />
      </div>
    </main>
  )
}
