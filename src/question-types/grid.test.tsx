import { describe, it, expect } from 'vitest'
import { grid } from './grid'

describe('grid', () => {
  it('defaultQuestion produces a valid question', () => {
    const q = grid.defaultQuestion()
    expect(q.type).toBe('grid')
    expect(q.rows?.length).toBeGreaterThan(0)
    expect(q.columns?.length).toBeGreaterThan(0)
  })

  it('validate returns error when text is empty', () => {
    const q = grid.defaultQuestion()
    q.text = ''
    expect(grid.validate(q)).toContain('Question text is required.')
  })

  it('validate returns no errors for a complete question', () => {
    const q = grid.defaultQuestion()
    q.text = 'Rate each item'
    expect(grid.validate(q)).toHaveLength(0)
  })
})
