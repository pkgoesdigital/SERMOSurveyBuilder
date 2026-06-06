import { describe, it, expect } from 'vitest'
import { mapUsState } from './map-us-state'

describe('mapUsState', () => {
  describe('defaultQuestion', () => {
    it('returns a valid question with the correct type', () => {
      const q = mapUsState.defaultQuestion()
      expect(q.type).toBe('map-us-state')
      expect(q.text).toBeTruthy()
      expect(q.id).toBeTruthy()
      expect(typeof q.required).toBe('boolean')
    })

    it('does not include options, rows, or columns', () => {
      const q = mapUsState.defaultQuestion()
      expect(q.options).toBeUndefined()
      expect(q.rows).toBeUndefined()
      expect(q.columns).toBeUndefined()
    })
  })

  describe('validate', () => {
    it('returns no errors for a valid question', () => {
      const q = mapUsState.defaultQuestion()
      expect(mapUsState.validate(q)).toEqual([])
    })

    it('returns an error when question text is empty', () => {
      const q = { ...mapUsState.defaultQuestion(), text: '' }
      expect(mapUsState.validate(q)).toContain('Question text is required.')
    })

    it('returns an error when question text is only whitespace', () => {
      const q = { ...mapUsState.defaultQuestion(), text: '   ' }
      expect(mapUsState.validate(q)).toContain('Question text is required.')
    })
  })

  describe('toExportShape', () => {
    it('exports the correct fields', () => {
      const q = {
        ...mapUsState.defaultQuestion(),
        text: 'Which state do you live in?',
        description: 'Select your home state.',
        required: true,
      }
      const shape = mapUsState.toExportShape(q)
      expect(shape).toEqual({
        id: q.id,
        type: 'map-us-state',
        text: 'Which state do you live in?',
        description: 'Select your home state.',
        required: true,
      })
    })

    it('does not include options in export', () => {
      const q = mapUsState.defaultQuestion()
      const shape = mapUsState.toExportShape(q) as Record<string, unknown>
      expect(shape.options).toBeUndefined()
    })
  })

  describe('registry fields', () => {
    it('has correct type key', () => {
      expect(mapUsState.type).toBe('map-us-state')
    })

    it('has a label and icon', () => {
      expect(mapUsState.label).toBeTruthy()
      expect(mapUsState.icon).toBeTruthy()
    })

    it('has a color CSS variable', () => {
      expect(mapUsState.color).toMatch(/^var\(/)
    })
  })
})
