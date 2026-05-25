import type { Survey, BranchingRule } from './types'

/**
 * Given the current question id and the selected answer id,
 * returns the id of the question to navigate to next,
 * or null if no rule matches (advance normally).
 */
export const evaluateBranching = (
  survey: Survey,
  currentQuestionId: string,
  selectedAnswerId: string,
): string | null => {
  const rule = survey.branchingRules.find(
    (r: BranchingRule) =>
      r.sourceQuestionId === currentQuestionId &&
      r.answerId === selectedAnswerId,
  )
  return rule?.targetQuestionId ?? null
}

/**
 * Returns the next question id in linear order (no branching).
 * Returns null if current question is the last one.
 */
export const getNextQuestionId = (
  survey: Survey,
  currentQuestionId: string,
): string | null => {
  const idx = survey.questions.findIndex((q) => q.id === currentQuestionId)
  if (idx === -1 || idx === survey.questions.length - 1) return null
  return survey.questions[idx + 1].id
}
