import type { ComponentType } from 'react'

export type QuestionType = 'single-select' | 'multi-select' | 'numeric' | 'grid'

export type Option = {
  id: string
  text: string
}

export type Question = {
  id: string
  type: QuestionType
  text: string
  description?: string
  required: boolean
  // single-select, multi-select
  options?: Option[]
  // grid
  rows?: string[]
  columns?: string[]
  // numeric
  min?: number
  max?: number
}

export type BranchingRule = {
  id: string
  sourceQuestionId: string
  answerId: string         // option id that triggers this rule
  targetQuestionId: string // question to skip to
}

export type Survey = {
  id: string
  title: string
  questions: Question[]
  branchingRules: BranchingRule[]
  createdAt: string
  updatedAt: string
}

// Props passed to every BuilderEditor component in the registry
export type EditorProps = {
  question: Question
  onChange: (updated: Question) => void
}

// Props passed to every RespondentInput component in the registry
export type InputProps = {
  question: Question
  value: string | string[] | null
  onChange: (value: string | string[]) => void
  onAutoAdvance?: () => void  // called immediately on selection (single-select)
}

// Keep ComponentType available for registry without React namespace
export type { ComponentType }
