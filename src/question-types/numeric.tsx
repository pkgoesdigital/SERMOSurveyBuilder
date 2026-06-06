import React from 'react'
import type { QuestionTypeDefinition, EditorProps, InputProps } from './registry'
import type { Question } from '../lib/types'
import { generateId } from '../lib/utils'

// ── BuilderEditor ────────────────────────────────────────────
const BuilderEditor: React.FC<EditorProps> = ({ question, onChange }) => {
  const min = question.min ?? 0
  const max = question.max ?? 100

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <label className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-[var(--color-text-muted)]">Min</span>
          <input
            type="number"
            value={min}
            onChange={(e) => onChange({ ...question, min: Number(e.target.value) })}
            className="px-3 py-2 rounded border border-[var(--color-border)]
                       bg-[var(--color-surface)] text-[var(--color-text)] text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Minimum value"
          />
        </label>
        <label className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-[var(--color-text-muted)]">Max</span>
          <input
            type="number"
            value={max}
            onChange={(e) => onChange({ ...question, max: Number(e.target.value) })}
            className="px-3 py-2 rounded border border-[var(--color-border)]
                       bg-[var(--color-surface)] text-[var(--color-text)] text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Maximum value"
          />
        </label>
      </div>
      {min >= max && (
        <p className="text-xs text-red-500">Min must be less than max.</p>
      )}
    </div>
  )
}

// ── RespondentInput ──────────────────────────────────────────
// Slider + numeric display. No auto-advance — physician sets value then continues.
const RespondentInput: React.FC<InputProps> = ({ question, value, onChange }) => {
  const min = question.min ?? 0
  const max = question.max ?? 100
  const current = value !== null && !Array.isArray(value) ? Number(value) : min

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-center">
        <span
          className="text-5xl font-bold tabular-nums"
          style={{ color: 'var(--color-accent)' }}
          aria-live="polite"
          aria-label={`Current value: ${current}`}
        >
          {current}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--color-text-muted)] w-8 text-right">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={current}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-2 accent-[var(--color-accent)]"
          aria-label={`Select a number between ${min} and ${max}`}
          style={{ minHeight: 44 }}
        />
        <span className="text-sm text-[var(--color-text-muted)] w-8">{max}</span>
      </div>
    </div>
  )
}

// ── Type Definition ──────────────────────────────────────────
export const numeric: QuestionTypeDefinition = {
  type: 'numeric',
  label: 'Numeric',
  icon: 'hash',
  color: 'var(--type-color-numeric)',
  singleSelection: false,

  defaultQuestion: (): Question => ({
    id: generateId(),
    type: 'numeric',
    text: 'Untitled question',
    required: false,
    min: 0,
    max: 10,
  }),

  BuilderEditor,
  RespondentInput,

  validate: (q: Question): string[] => {
    const errors: string[] = []
    if (!q.text.trim()) errors.push('Question text is required.')
    if (q.min !== undefined && q.max !== undefined && q.min >= q.max) {
      errors.push('Min must be less than max.')
    }
    return errors
  },

  toExportShape: (q: Question) => ({
    id: q.id,
    type: q.type,
    text: q.text,
    description: q.description,
    required: q.required,
    min: q.min,
    max: q.max,
  }),
}
