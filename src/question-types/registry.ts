import type React from 'react'
import type { Question, EditorProps, InputProps } from '../lib/types'
import { singleSelect } from './single-select'
import { multiSelect } from './multi-select'
import { numeric } from './numeric'
import { grid } from './grid'

export type QuestionTypeDefinition = {
  type: string                                    // unique key e.g. 'single-select'
  label: string                                   // e.g. 'Single Select'
  icon: string                                    // lucide icon name e.g. 'circle-dot'
  color: string                                   // CSS var e.g. 'var(--type-color-single)'
  defaultQuestion: () => Question                 // factory for new questions of this type
  BuilderEditor: React.FC<EditorProps>            // answer config UI in PropertiesPanel
  RespondentInput: React.FC<InputProps>           // answer UI in RespondentView
  validate: (q: Question) => string[]             // [] = valid, else error messages
  toExportShape: (q: Question) => object          // serializes for JSON export
}

// Re-export so question-type files can import everything from one place
export type { EditorProps, InputProps } from '../lib/types'

// ─── REGISTRY ───────────────────────────────────────────────
// To add a 5th question type:
//   1. Create src/question-types/<name>.tsx
//   2. Implement QuestionTypeDefinition
//   3. Import and add to this array
//   Builder, canvas, properties panel, respondent view, and
//   JSON export all pick it up. No other files change.
// ────────────────────────────────────────────────────────────
export const questionRegistry: QuestionTypeDefinition[] = [
  singleSelect,
  multiSelect,
  numeric,
  grid,
]

export const getTypeDefinition = (type: string): QuestionTypeDefinition => {
  const def = questionRegistry.find((d) => d.type === type)
  if (!def) throw new Error(`Unknown question type: "${type}". Add it to registry.ts.`)
  return def
}
