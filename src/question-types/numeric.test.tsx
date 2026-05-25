import { describe, it, expect } from 'vitest'
import { numeric } from './numeric'

describe('numeric', () => {
  it('defaultQuestion produces a valid question', () => {
    const q = numeric.defaultQuestion()
    expect(q.type).toBe('numeric')
    expect(q.min).toBeDefined()
    expect(q.max).toBeDefined()
  })

  it('validate returns error when min >= max', () => {
    const q = numeric.defaultQuestion()
    q.text = 'Rate from 1-10'
    q.min = 10
    q.max = 5
    expect(numeric.validate(q)).toContain('Min must be less than max.')
  })

  it('validate returns no errors for a complete question', () => {
    const q = numeric.defaultQuestion()
    q.text = 'How many?'
    expect(numeric.validate(q)).toHaveLength(0)
  })
})
