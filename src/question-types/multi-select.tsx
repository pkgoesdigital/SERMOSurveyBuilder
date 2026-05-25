import React from 'react'
import type { QuestionTypeDefinition, EditorProps, InputProps } from './registry'
import type { Question } from '../lib/types'
import { generateId } from '../lib/utils'

// ── BuilderEditor ────────────────────────────────────────────
const BuilderEditor: React.FC<EditorProps> = ({ question, onChange }) => {
  const options = question.options ?? []

  const addOption = () => {
    onChange({
      ...question,
      options: [...options, { id: generateId(), text: `Option ${options.length + 1}` }],
    })
  }

  const updateOption = (id: string, text: string) => {
    onChange({
      ...question,
      options: options.map((o) => (o.id === id ? { ...o, text } : o)),
    })
  }

  const removeOption = (id: string) => {
    onChange({ ...question, options: options.filter((o) => o.id !== id) })
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <div key={opt.id} className="flex items-center gap-2">
          <input
            type="text"
            value={opt.text}
            onChange={(e) => updateOption(opt.id, e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-[var(--color-border)]
                       bg-[var(--color-surface)] text-[var(--color-text)] text-sm
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Option text"
          />
          <button
            onClick={() => removeOption(opt.id)}
            aria-label="Remove option"
            className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors
                       min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addOption}
        className="mt-1 text-sm text-[var(--color-accent)] hover:underline text-left
                   min-h-[44px] flex items-center"
      >
        + Add option
      </button>
    </div>
  )
}

// ── RespondentInput ──────────────────────────────────────────
// Multi-select requires explicit "Continue" — no auto-advance.
const RespondentInput: React.FC<InputProps> = ({ question, value, onChange }) => {
  const options = question.options ?? []
  const selected = Array.isArray(value) ? value : []

  const toggle = (optionId: string) => {
    const next = selected.includes(optionId)
      ? selected.filter((id) => id !== optionId)
      : [...selected, optionId]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      {options.map((opt) => {
        const isChecked = selected.includes(opt.id)
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            role="checkbox"
            aria-checked={isChecked}
            className={`
              w-full text-left px-6 py-4 rounded-lg border-2 transition-all
              min-h-[56px] text-base font-medium flex items-center gap-3
              ${isChecked
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)]'
              }
            `}
          >
            <span
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                ${isChecked ? 'border-white bg-white/30' : 'border-current'}
              `}
              aria-hidden
            >
              {isChecked && '✓'}
            </span>
            {opt.text}
          </button>
        )
      })}
    </div>
  )
}

// ── Type Definition ──────────────────────────────────────────
export const multiSelect: QuestionTypeDefinition = {
  type: 'multi-select',
  label: 'Multi Select',
  icon: 'check-square',
  color: 'var(--type-color-multi)',

  defaultQuestion: (): Question => ({
    id: generateId(),
    type: 'multi-select',
    text: 'Untitled question',
    required: false,
    options: [
      { id: generateId(), text: 'Option A' },
      { id: generateId(), text: 'Option B' },
      { id: generateId(), text: 'Option C' },
    ],
  }),

  BuilderEditor,
  RespondentInput,

  validate: (q: Question): string[] => {
    const errors: string[] = []
    if (!q.text.trim()) errors.push('Question text is required.')
    if (!q.options || q.options.length < 2) errors.push('At least 2 options required.')
    return errors
  },

  toExportShape: (q: Question) => ({
    id: q.id,
    type: q.type,
    text: q.text,
    description: q.description,
    required: q.required,
    options: (q.options ?? []).map((o) => ({ id: o.id, text: o.text })),
  }),
}
