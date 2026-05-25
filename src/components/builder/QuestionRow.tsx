import type { Question } from '../../lib/types'
import { questionRegistry } from '../../question-types/registry'

interface QuestionRowProps {
  question: Question
  index: number
  isActive: boolean
  onSelect: () => void
}

export default function QuestionRow({
  question,
  index,
  isActive,
  onSelect,
}: QuestionRowProps) {
  const def = questionRegistry.find((d) => d.type === question.type)

  return (
    <button
      aria-label={`Question ${index + 1}: ${question.text || 'Untitled'}`}
      aria-pressed={isActive}
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        minHeight: 44,
        padding: '0 8px',
        borderRadius: 6,
        border: 'none',
        background: isActive ? 'var(--color-bg)' : 'transparent',
        color: 'var(--color-text)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          flexShrink: 0,
          background: def?.color ?? 'var(--color-border)',
        }}
      />
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>
        {index + 1}
      </span>
      <span
        style={{
          fontSize: 13,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}
      >
        {question.text || <em style={{ opacity: 0.5 }}>Untitled</em>}
      </span>
    </button>
  )
}
