import React, { useRef, useState } from 'react'
import type { QuestionTypeDefinition, EditorProps, InputProps } from './registry'
import type { Question } from '../lib/types'
import { generateId } from '../lib/utils'

// All 50 US states — alphabetical order
export const US_STATES: string[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]

// ── BuilderEditor ────────────────────────────────────────────
const BuilderEditor: React.FC<EditorProps> = () => (
  <div
    className="flex flex-col gap-3 p-3 rounded border border-[var(--color-border)]
               bg-[var(--color-surface)]"
  >
    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
      Respondents pick one US state from a searchable list. No configuration needed.
    </p>
    {/* Preview — first few states */}
    <ul
      className="rounded border border-[var(--color-border)] overflow-hidden"
      aria-hidden="true"
    >
      {US_STATES.slice(0, 4).map((state) => (
        <li
          key={state}
          className="px-3 py-2 text-sm border-b border-[var(--color-border)] last:border-b-0"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {state}
        </li>
      ))}
      <li
        className="px-3 py-2 text-xs italic"
        style={{ color: 'var(--color-text-muted)' }}
      >
        + 46 more…
      </li>
    </ul>
  </div>
)

// ── RespondentInput ──────────────────────────────────────────
const RespondentInput: React.FC<InputProps> = ({ value, onChange, onAutoAdvance }) => {
  const [search, setSearch] = useState('')
  // confirmingState: the state currently showing the spinner before auto-advance
  const [confirmingState, setConfirmingState] = useState<string | null>(null)
  const selectedState = typeof value === 'string' && value ? value : null

  // Ref to the selected list item — scrolls it into view on selection change
  const selectedItemRef = useRef<HTMLLIElement | null>(null)
  // Ref for the pending advance timeout — allows cancellation on rapid re-selection
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtered = search.trim()
    ? US_STATES.filter((s) => s.toLowerCase().includes(search.toLowerCase()))
    : US_STATES

  const handleSelect = (stateName: string) => {
    // Record the answer immediately — no data loss if user navigates away
    onChange(stateName)

    // Cancel any in-flight advance from a prior selection
    if (advanceTimer.current) clearTimeout(advanceTimer.current)

    // Show spinner for 500ms so the user can confirm their selection visually
    setConfirmingState(stateName)
    advanceTimer.current = setTimeout(() => {
      setConfirmingState(null)
      onAutoAdvance?.()
    }, 500)
  }

  const scrollSelectedIntoView = (el: HTMLLIElement | null) => {
    selectedItemRef.current = el
    el?.scrollIntoView({ block: 'nearest' })
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">

      {/* ── Search input ──────────────────────────────────── */}
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none"
          aria-hidden="true"
          style={{ color: 'var(--color-text-muted)' }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Search states…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 rounded-lg border border-[var(--color-border)]
                     bg-[var(--color-surface)] text-[var(--color-text)] text-base
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          style={{ minHeight: 48 }}
          aria-label="Search US states"
          autoComplete="off"
        />
      </div>

      {/* ── Scrollable state list ─────────────────────────── */}
      <ul
        className="overflow-y-auto rounded-lg border border-[var(--color-border)]
                   bg-[var(--color-surface)]"
        style={{ maxHeight: '52vh' }}  /* ~60% viewport on mobile, leaves room for keyboard */
        role="listbox"
        aria-label="US States"
        aria-activedescendant={selectedState ? `state-opt-${selectedState}` : undefined}
      >
        {filtered.length === 0 && (
          <li
            className="px-4 py-4 text-sm text-center"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No states match "{search}"
          </li>
        )}
        {filtered.map((state) => {
          const isSelected = state === selectedState
          return (
            <li
              key={state}
              id={`state-opt-${state}`}
              ref={isSelected ? scrollSelectedIntoView : null}
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(state)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelect(state)
                }
              }}
              tabIndex={0}
              className="flex items-center justify-between px-4 cursor-pointer select-none
                         border-b border-[var(--color-border)] last:border-b-0
                         transition-colors"
              style={{
                minHeight: 56,   // WCAG-friendly touch target
                background: isSelected ? 'var(--color-accent)' : 'transparent',
                color: isSelected ? '#fff' : 'var(--color-text)',
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              <span>{state}</span>
              {isSelected && (
                confirmingState === state ? (
                  /* Spinner — shown for 500ms while auto-advance is pending */
                  <span
                    aria-label="Confirming selection…"
                    style={{
                      display: 'inline-block',
                      width: 18,
                      height: 18,
                      border: '2.5px solid rgba(255,255,255,0.35)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'rsm-spin 0.6s linear infinite',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <span aria-hidden="true" style={{ fontSize: 18 }}>✓</span>
                )
              )}
            </li>
          )
        })}
      </ul>

      {/* ── Selection confirmation ────────────────────────── */}
      <p
        className="text-center text-sm min-h-[28px]"
        style={{ color: selectedState ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
        aria-live="polite"
      >
        {selectedState ? `✓ Selected: ${selectedState}` : 'Tap a state to select'}
      </p>
    </div>
  )
}

// ── Type Definition ──────────────────────────────────────────
export const mapUsState: QuestionTypeDefinition = {
  type: 'map-us-state',
  label: 'US State Map',
  icon: 'map-pin',
  color: 'var(--type-color-map)',
  singleSelection: true,

  defaultQuestion: (): Question => ({
    id: generateId(),
    type: 'map-us-state',
    text: 'Which state do you live in?',
    required: false,
  }),

  BuilderEditor,
  RespondentInput,

  validate: (q: Question): string[] => {
    const errors: string[] = []
    if (!q.text.trim()) errors.push('Question text is required.')
    return errors
  },

  toExportShape: (q: Question) => ({
    id: q.id,
    type: q.type,
    text: q.text,
    description: q.description,
    required: q.required,
  }),
}
