import { describe, it, expect } from 'vitest'
import { singleSelect } from './single-select'

describe('singleSelect', () => {
  it('defaultQuestion produces a valid question', () => {
    const q = singleSelect.defaultQuestion()
    expect(q.type).toBe('single-select')
    expect(q.options?.length).toBeGreaterThan(0)
  })

  it('validate returns error when text is empty', () => {
    const q = singleSelect.defaultQuestion()
    q.text = ''
    expect(singleSelect.validate(q)).toContain('Question text is required.')
  })

  it('validate returns no errors for a complete question', () => {
    const q = singleSelect.defaultQuestion()
    q.text = 'Which do you prefer?'
    expect(singleSelect.validate(q)).toHaveLength(0)
  })
})
