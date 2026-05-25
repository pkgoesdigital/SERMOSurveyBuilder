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

// UTF-8 safe base64url encoding. `btoa` only handles Latin-1, so we
// route through TextEncoder first to keep em-dashes and unicode intact.
function base64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (str.length % 4)) % 4)
  const bin = atob(padded)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function encodeSurveyForShare(survey: Survey): string {
  return base64urlEncode(JSON.stringify(survey))
}

export function decodeSurveyFromShare(encoded: string): Survey | null {
  try {
    return JSON.parse(base64urlDecode(encoded)) as Survey
  } catch {
    return null
  }
}
