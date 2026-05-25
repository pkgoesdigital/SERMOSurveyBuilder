import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Question } from '../../lib/types'
import { questionRegistry } from '../../question-types/registry'

interface QuestionRowProps {
  question: Question
  index: number
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export default function QuestionRow({
  question,
  index,
  isActive,
  onSelect,
  onDelete,
}: QuestionRowProps) {
  const def = questionRegistry.find((d) => d.type === question.type)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      role="row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 6,
        background: isActive ? 'var(--color-bg)' : 'transparent',
      }}
    >
      <button
        aria-label={`Question ${index + 1}: ${question.text || 'Untitled'}`}
        aria-pressed={isActive}
        onClick={onSelect}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: 1,
          minHeight: 44,
          minWidth: 0,
          padding: '0 8px',
          border: 'none',
          background: 'transparent',
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

      <button
        aria-label={`Delete question ${index + 1}`}
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: 32,
          height: 32,
          marginRight: 4,
          border: 'none',
          borderRadius: 4,
          background: 'transparent',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s, color 0.15s',
          pointerEvents: hovered ? 'auto' : 'none',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
