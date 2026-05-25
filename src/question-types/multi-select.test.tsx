import { describe, it, expect } from 'vitest'
import { multiSelect } from './multi-select'

describe('multiSelect', () => {
  it('defaultQuestion produces a valid question', () => {
    const q = multiSelect.defaultQuestion()
    expect(q.type).toBe('multi-select')
    expect(q.options?.length).toBeGreaterThan(0)
  })

  it('validate returns error when text is empty', () => {
    const q = multiSelect.defaultQuestion()
    q.text = ''
    expect(multiSelect.validate(q)).toContain('Question text is required.')
  })

  it('validate returns no errors for a complete question', () => {
    const q = multiSelect.defaultQuestion()
    q.text = 'Select all that apply'
    expect(multiSelect.validate(q)).toHaveLength(0)
  })
})
