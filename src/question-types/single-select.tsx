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
const RespondentInput: React.FC<InputProps> = ({ question, value, onChange, onAutoAdvance }) => {
  const options = question.options ?? []

  const handleSelect = (optionId: string) => {
    onChange(optionId)
    // Auto-advance: fire immediately after selection, not after a "Next" click
    onAutoAdvance?.()
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handleSelect(opt.id)}
          aria-pressed={value === opt.id}
          className={`
            w-full text-left px-6 py-4 rounded-lg border-2 transition-all
            min-h-[56px] text-base font-medium
            ${value === opt.id
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)]'
            }
          `}
        >
          {opt.text}
        </button>
      ))}
    </div>
  )
}

// ── Type Definition ──────────────────────────────────────────
export const singleSelect: QuestionTypeDefinition = {
  type: 'single-select',
  label: 'Single Select',
  icon: 'circle-dot',
  color: 'var(--type-color-single)',

  defaultQuestion: (): Question => ({
    id: generateId(),
    type: 'single-select',
    text: 'Untitled question',
    required: false,
    options: [
      { id: generateId(), text: 'Option A' },
      { id: generateId(), text: 'Option B' },
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
