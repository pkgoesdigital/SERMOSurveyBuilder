import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SurveyProvider, useSurvey } from './SurveyContext'
import { singleSelect } from '../question-types/single-select'

describe('SurveyContext', () => {
  it('starts with an empty survey', () => {
    const { result } = renderHook(() => useSurvey(), {
      wrapper: SurveyProvider,
    })
    expect(result.current.survey.questions).toHaveLength(0)
    expect(result.current.survey.title).toBe('Untitled Survey')
  })

  it('addQuestion appends a question', () => {
    const { result } = renderHook(() => useSurvey(), {
      wrapper: SurveyProvider,
    })
    act(() => {
      result.current.addQuestion(singleSelect.defaultQuestion())
    })
    expect(result.current.survey.questions).toHaveLength(1)
  })

  it('deleteQuestion removes the question', () => {
    const { result } = renderHook(() => useSurvey(), {
      wrapper: SurveyProvider,
    })
    const q = singleSelect.defaultQuestion()
    act(() => {
      result.current.addQuestion(q)
    })
    act(() => {
      result.current.deleteQuestion(q.id)
    })
    expect(result.current.survey.questions).toHaveLength(0)
  })
})
