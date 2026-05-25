import { useState } from 'react'
import { useSurvey } from '../../contexts/SurveyContext'
import { questionRegistry } from '../../question-types/registry'

export default function AddQuestionMenu() {
  const { addQuestion, setActiveQuestionId } = useSurvey()
  const [open, setOpen] = useState(false)

  function handleAdd(defIndex: number) {
    const def = questionRegistry[defIndex]
    const q = def.defaultQuestion()
    addQuestion(q)
    setActiveQuestionId(q.id)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        aria-label="Add question"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          minHeight: 44,
          background: 'var(--color-accent)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        + Add question
      </button>
      {open && (
        <ul
          role="menu"
          aria-label="Question types"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: 4,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            listStyle: 'none',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {questionRegistry.map((def, i) => (
            <li key={def.type}>
              <button
                role="menuitem"
                onClick={() => handleAdd(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  minHeight: 44,
                  padding: '0 12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: def.color,
                    flexShrink: 0,
                  }}
                />
                {def.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
