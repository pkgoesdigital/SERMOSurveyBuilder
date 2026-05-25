import { useSurvey } from '../../contexts/SurveyContext'
import { getTypeDefinition } from '../../question-types/registry'
import BranchingEditor from '../builder/BranchingEditor'

export default function PropertiesPanel() {
  const { survey, activeQuestionId, updateQuestion } = useSurvey()
  const activeQuestion = survey.questions.find((q) => q.id === activeQuestionId)

  if (!activeQuestion) {
    return (
      <aside
        aria-label="Properties"
        style={{
          width: 260,
          flexShrink: 0,
          borderLeft: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}
      >
        Select a question
      </aside>
    )
  }

  const def = getTypeDefinition(activeQuestion.type)

  return (
    <aside
      aria-label="Properties"
      style={{
        width: 260,
        flexShrink: 0,
        borderLeft: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <def.BuilderEditor
        question={activeQuestion}
        onChange={(updated) => updateQuestion(updated.id, updated)}
      />
      <BranchingEditor />
    </aside>
  )
}
