import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useSurvey } from '../../contexts/SurveyContext'
import { generateId } from '../../lib/utils'

function clip(text: string, max = 28): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

const pillSelectStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 72,
  padding: '3px 4px',
  fontSize: 11,
  border: '1px solid var(--color-border)',
  borderRadius: 4,
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  cursor: 'pointer',
}

export default function BranchingEditor() {
  const { survey, activeQuestionId, addBranchingRule, deleteBranchingRule } = useSurvey()
  const [isAdding, setIsAdding] = useState(false)
  const [pendingAnswerId, setPendingAnswerId] = useState('')
  const [pendingTargetId, setPendingTargetId] = useState('')

  const activeQuestion = survey.questions.find((q) => q.id === activeQuestionId)
  if (!activeQuestion) return null

  const hasOptions = (activeQuestion.options?.length ?? 0) > 0
  const rules = survey.branchingRules.filter((r) => r.sourceQuestionId === activeQuestionId)
  const otherQuestions = survey.questions.filter((q) => q.id !== activeQuestionId)

  function handleAdd() {
    if (!pendingAnswerId || !pendingTargetId || !activeQuestionId) return
    addBranchingRule({
      id: generateId(),
      sourceQuestionId: activeQuestionId,
      answerId: pendingAnswerId,
      targetQuestionId: pendingTargetId,
    })
    setIsAdding(false)
    setPendingAnswerId('')
    setPendingTargetId('')
  }

  function handleCancel() {
    setIsAdding(false)
    setPendingAnswerId('')
    setPendingTargetId('')
  }

  return (
    <section
      aria-label="Branching rules"
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', margin: 0 }}>
        Branching
      </p>

      {!hasOptions ? (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
          Add answer options to create branching rules.
        </p>
      ) : (
        <>
          {rules.length === 0 && !isAdding && (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
              No rules yet.
            </p>
          )}

          {rules.map((rule) => {
            const answer = activeQuestion.options?.find((o) => o.id === rule.answerId)
            const targetIdx = survey.questions.findIndex((q) => q.id === rule.targetQuestionId)
            const answerText = answer?.text ?? 'Unknown'
            const targetQ = survey.questions[targetIdx]
            const fullLabel = `If "${answerText}" → Q${targetIdx + 1}${targetQ ? ': ' + targetQ.text : ' (deleted)'}`
            return (
              <div
                key={rule.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  background: 'var(--color-bg)',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  fontSize: 12,
                }}
              >
                <span
                  title={fullLabel}
                  style={{ flex: 1, color: 'var(--color-text)' }}
                >
                  If <strong>"{clip(answerText)}"</strong> → Q{targetIdx + 1}
                  {targetIdx === -1 ? ' (deleted)' : ''}
                </span>
                <button
                  aria-label="Delete branching rule"
                  onClick={() => deleteBranchingRule(rule.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    border: 'none',
                    borderRadius: 4,
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}

          {isAdding ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>If</span>
                <select
                  aria-label="If answer is"
                  value={pendingAnswerId}
                  onChange={(e) => setPendingAnswerId(e.target.value)}
                  style={pillSelectStyle}
                >
                  <option value="">answer…</option>
                  {activeQuestion.options?.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.text || '(empty)'}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>→</span>
                <select
                  aria-label="Skip to question"
                  value={pendingTargetId}
                  onChange={(e) => setPendingTargetId(e.target.value)}
                  style={pillSelectStyle}
                >
                  <option value="">skip to…</option>
                  {otherQuestions.map((q) => {
                    const qIdx = survey.questions.findIndex((sq) => sq.id === q.id)
                    return (
                      <option key={q.id} value={q.id}>
                        Q{qIdx + 1}: {q.text || 'Untitled'}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    border: '1px solid var(--color-border)',
                    borderRadius: 4,
                    background: 'transparent',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!pendingAnswerId || !pendingTargetId}
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    border: 'none',
                    borderRadius: 4,
                    background: 'var(--color-accent)',
                    color: '#fff',
                    cursor: pendingAnswerId && pendingTargetId ? 'pointer' : 'not-allowed',
                    opacity: pendingAnswerId && pendingTargetId ? 1 : 0.5,
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              disabled={otherQuestions.length === 0}
              aria-label="Add branching rule"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 8px',
                fontSize: 12,
                border: '1px dashed var(--color-border)',
                borderRadius: 4,
                background: 'transparent',
                color: 'var(--color-text-muted)',
                cursor: otherQuestions.length > 0 ? 'pointer' : 'not-allowed',
                opacity: otherQuestions.length > 0 ? 1 : 0.5,
              }}
            >
              <Plus size={12} />
              Add rule
            </button>
          )}
        </>
      )}
    </section>
  )
}
