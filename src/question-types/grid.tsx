import React from 'react'
import type { QuestionTypeDefinition, EditorProps, InputProps } from './registry'
import type { Question } from '../lib/types'
import { generateId } from '../lib/utils'

// Grid answers encoded as string[] of "rowIndex:colIndex" pairs (one per row)

// ── BuilderEditor ────────────────────────────────────────────
const BuilderEditor: React.FC<EditorProps> = ({ question, onChange }) => {
  const rows = question.rows ?? []
  const cols = question.columns ?? []

  const updateRow = (i: number, text: string) => {
    const next = [...rows]
    next[i] = text
    onChange({ ...question, rows: next })
  }

  const updateCol = (i: number, text: string) => {
    const next = [...cols]
    next[i] = text
    onChange({ ...question, columns: next })
  }

  const addRow = () => onChange({ ...question, rows: [...rows, `Row ${rows.length + 1}`] })
  const addCol = () => onChange({ ...question, columns: [...cols, `Col ${cols.length + 1}`] })
  const removeRow = (i: number) => onChange({ ...question, rows: rows.filter((_, idx) => idx !== i) })
  const removeCol = (i: number) => onChange({ ...question, columns: cols.filter((_, idx) => idx !== i) })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Rows</p>
        <div className="flex flex-col gap-1">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={row}
                onChange={(e) => updateRow(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-[var(--color-border)]
                           bg-[var(--color-surface)] text-[var(--color-text)] text-sm
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                aria-label={`Row ${i + 1} label`}
              />
              <button
                onClick={() => removeRow(i)}
                aria-label="Remove row"
                className="text-[var(--color-text-muted)] hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addRow}
            className="text-sm text-[var(--color-accent)] hover:underline text-left min-h-[44px] flex items-center"
          >
            + Add row
          </button>
        </div>
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Columns</p>
        <div className="flex flex-col gap-1">
          {cols.map((col, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={col}
                onChange={(e) => updateCol(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-[var(--color-border)]
                           bg-[var(--color-surface)] text-[var(--color-text)] text-sm
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                aria-label={`Column ${i + 1} label`}
              />
              <button
                onClick={() => removeCol(i)}
                aria-label="Remove column"
                className="text-[var(--color-text-muted)] hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addCol}
            className="text-sm text-[var(--color-accent)] hover:underline text-left min-h-[44px] flex items-center"
          >
            + Add column
          </button>
        </div>
      </div>
    </div>
  )
}

// ── RespondentInput ──────────────────────────────────────────
// One radio per row × col cell. Answers encoded as "rowIndex:colIndex" per row.
const RespondentInput: React.FC<InputProps> = ({ question, value, onChange }) => {
  const rows = question.rows ?? []
  const cols = question.columns ?? []
  const selected = Array.isArray(value) ? value : []

  const getColForRow = (rowIndex: number): number | null => {
    const entry = selected.find((s) => s.startsWith(`${rowIndex}:`))
    if (!entry) return null
    return Number(entry.split(':')[1])
  }

  const handleSelect = (rowIndex: number, colIndex: number) => {
    const next = [
      ...selected.filter((s) => !s.startsWith(`${rowIndex}:`)),
      `${rowIndex}:${colIndex}`,
    ]
    onChange(next)
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 pr-4 text-[var(--color-text-muted)] font-normal min-w-[120px]" />
            {cols.map((col, ci) => (
              <th
                key={ci}
                className="text-center py-2 px-3 text-[var(--color-text)] font-medium"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t border-[var(--color-border)]"
            >
              <td className="py-3 pr-4 text-[var(--color-text)]">{row}</td>
              {cols.map((_, ci) => {
                const isSelected = getColForRow(ri) === ci
                return (
                  <td key={ci} className="text-center py-3 px-3">
                    <button
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${row}: ${cols[ci]}`}
                      onClick={() => handleSelect(ri, ci)}
                      className={`
                        w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center
                        min-w-[44px] min-h-[44px] transition-all
                        ${isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white block" aria-hidden />
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Type Definition ──────────────────────────────────────────
export const grid: QuestionTypeDefinition = {
  type: 'grid',
  label: 'Grid',
  icon: 'grid-3x3',
  color: 'var(--type-color-grid)',

  defaultQuestion: (): Question => ({
    id: generateId(),
    type: 'grid',
    text: 'Untitled question',
    required: false,
    rows: ['Row 1', 'Row 2', 'Row 3'],
    columns: ['Never', 'Sometimes', 'Always'],
  }),

  BuilderEditor,
  RespondentInput,

  validate: (q: Question): string[] => {
    const errors: string[] = []
    if (!q.text.trim()) errors.push('Question text is required.')
    if (!q.rows?.length) errors.push('At least one row is required.')
    if (!q.columns?.length) errors.push('At least one column is required.')
    return errors
  },

  toExportShape: (q: Question) => ({
    id: q.id,
    type: q.type,
    text: q.text,
    description: q.description,
    required: q.required,
    rows: q.rows ?? [],
    columns: q.columns ?? [],
  }),
}
