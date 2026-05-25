import type { Survey } from './types'
import { getTypeDefinition } from '../question-types/registry'

export const exportSurveyToJSON = (survey: Survey): string => {
  const payload = {
    id: survey.id,
    title: survey.title,
    exportedAt: new Date().toISOString(),
    questions: survey.questions.map((q, i) => ({
      index: i + 1,
      ...getTypeDefinition(q.type).toExportShape(q),
    })),
    branchingRules: survey.branchingRules,
  }
  return JSON.stringify(payload, null, 2)
}
