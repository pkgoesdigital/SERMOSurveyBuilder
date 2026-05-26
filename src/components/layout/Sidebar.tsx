import { useSurvey } from '../../contexts/SurveyContext'
import QuestionRow from '../builder/QuestionRow'
import AddQuestionMenu from '../builder/AddQuestionMenu'

export default function Sidebar() {
  const { survey, activeQuestionId, setActiveQuestionId, deleteQuestion, reorderQuestions } = useSurvey()

  function handleDelete(id: string) {
    if (activeQuestionId === id) {
      const idx = survey.questions.findIndex((q) => q.id === id)
      const next = survey.questions[idx + 1] ?? survey.questions[idx - 1] ?? null
      setActiveQuestionId(next?.id ?? null)
    }
    deleteQuestion(id)
  }

  return (
    <aside
      aria-label="Questions"
      style={{
        width: 220,
        flexShrink: 0,
        borderRight: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <ol style={{ flex: 1, overflowY: 'auto', listStyle: 'none', padding: 8 }}>
        {survey.questions.map((q, i) => (
          <li key={q.id}>
            <QuestionRow
              question={q}
              index={i}
              isActive={q.id === activeQuestionId}
              onSelect={() => setActiveQuestionId(q.id)}
              onDelete={() => handleDelete(q.id)}
              onMoveUp={i > 0 ? () => reorderQuestions(i, i - 1) : undefined}
              onMoveDown={i < survey.questions.length - 1 ? () => reorderQuestions(i, i + 1) : undefined}
              hasBranchingRule={survey.branchingRules.some((r) => r.sourceQuestionId === q.id)}
            />
          </li>
        ))}
      </ol>
      <div style={{ padding: 8, borderTop: '1px solid var(--color-border)' }}>
        <AddQuestionMenu />
      </div>
    </aside>
  )
}
