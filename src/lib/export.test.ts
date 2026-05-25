import { describe, it, expect } from 'vitest'
import { encodeSurveyForShare, decodeSurveyFromShare } from './export'
import type { Survey } from './types'

const sample: Survey = {
  id: 'test-1',
  title: 'Biosimilar Adoption — Pilot',
  questions: [
    {
      id: 'q1',
      type: 'single-select',
      text: 'What is your primary clinical specialty?',
      required: true,
      options: [
        { id: 'a', text: 'Rheumatology' },
        { id: 'b', text: 'Oncology / Hematology' },
      ],
    },
  ],
  branchingRules: [],
  createdAt: '2026-05-25T00:00:00.000Z',
  updatedAt: '2026-05-25T00:00:00.000Z',
}

describe('share encoding', () => {
  it('round-trips a survey through encode → decode', () => {
    const encoded = encodeSurveyForShare(sample)
    const decoded = decodeSurveyFromShare(encoded)
    expect(decoded).toEqual(sample)
  })

  it('produces a URL-safe string (no +, /, or =)', () => {
    const encoded = encodeSurveyForShare(sample)
    expect(encoded).not.toMatch(/[+/=]/)
  })

  it('preserves unicode characters (em-dashes, accents)', () => {
    const withUnicode: Survey = {
      ...sample,
      title: 'Café — Étude clinique 🩺',
    }
    const decoded = decodeSurveyFromShare(encodeSurveyForShare(withUnicode))
    expect(decoded?.title).toBe('Café — Étude clinique 🩺')
  })

  it('returns null for invalid input', () => {
    expect(decodeSurveyFromShare('not-valid-base64!!!')).toBeNull()
  })
})
