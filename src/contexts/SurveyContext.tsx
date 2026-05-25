import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Survey, Question, BranchingRule } from '../lib/types'
import { generateId } from '../lib/utils'

interface SurveyContextValue {
  survey: Survey
  setSurveyTitle: (title: string) => void
  addQuestion: (question: Question) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  reorderQuestions: (fromIndex: number, toIndex: number) => void
  activeQuestionId: string | null
  setActiveQuestionId: (id: string | null) => void
  addBranchingRule: (rule: BranchingRule) => void
  updateBranchingRule: (id: string, updates: Partial<BranchingRule>) => void
  deleteBranchingRule: (id: string) => void
}

const SurveyContext = createContext<SurveyContextValue | null>(null)

function makeDefaultSurvey(): Survey {
  return {
    id: generateId(),
    title: 'Untitled Survey',
    questions: [],
    branchingRules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [survey, setSurvey] = useState<Survey>(makeDefaultSurvey)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)

  const touch = (s: Survey): Survey => ({
    ...s,
    updatedAt: new Date().toISOString(),
  })

  const setSurveyTitle = useCallback((title: string) => {
    setSurvey((s) => touch({ ...s, title }))
  }, [])

  const addQuestion = useCallback((question: Question) => {
    setSurvey((s) => touch({ ...s, questions: [...s.questions, question] }))
  }, [])

  const updateQuestion = useCallback(
    (id: string, updates: Partial<Question>) => {
      setSurvey((s) =>
        touch({
          ...s,
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, ...updates } : q,
          ),
        }),
      )
    },
    [],
  )

  const deleteQuestion = useCallback((id: string) => {
    setSurvey((s) =>
      touch({ ...s, questions: s.questions.filter((q) => q.id !== id) }),
    )
  }, [])

  const reorderQuestions = useCallback(
    (fromIndex: number, toIndex: number) => {
      setSurvey((s) => {
        const questions = [...s.questions]
        const [moved] = questions.splice(fromIndex, 1)
        questions.splice(toIndex, 0, moved)
        return touch({ ...s, questions })
      })
    },
    [],
  )

  const addBranchingRule = useCallback((rule: BranchingRule) => {
    setSurvey((s) => touch({ ...s, branchingRules: [...s.branchingRules, rule] }))
  }, [])

  const updateBranchingRule = useCallback(
    (id: string, updates: Partial<BranchingRule>) => {
      setSurvey((s) =>
        touch({
          ...s,
          branchingRules: s.branchingRules.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        }),
      )
    },
    [],
  )

  const deleteBranchingRule = useCallback((id: string) => {
    setSurvey((s) =>
      touch({ ...s, branchingRules: s.branchingRules.filter((r) => r.id !== id) }),
    )
  }, [])

  return (
    <SurveyContext.Provider
      value={{
        survey,
        setSurveyTitle,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        activeQuestionId,
        setActiveQuestionId,
        addBranchingRule,
        updateBranchingRule,
        deleteBranchingRule,
      }}
    >
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey(): SurveyContextValue {
  const ctx = useContext(SurveyContext)
  if (!ctx) throw new Error('useSurvey must be used within SurveyProvider')
  return ctx
}
