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

  it('reorderQuestions moves a question to the target index', () => {
    const { result } = renderHook(() => useSurvey(), { wrapper: SurveyProvider })
    const q1 = singleSelect.defaultQuestion()
    const q2 = singleSelect.defaultQuestion()
    act(() => {
      result.current.addQuestion(q1)
      result.current.addQuestion(q2)
    })
    act(() => {
      result.current.reorderQuestions(0, 1)
    })
    expect(result.current.survey.questions[0].id).toBe(q2.id)
    expect(result.current.survey.questions[1].id).toBe(q1.id)
  })

  it('addBranchingRule appends a rule', () => {
    const { result } = renderHook(() => useSurvey(), { wrapper: SurveyProvider })
    const rule = { id: 'br1', sourceQuestionId: 'q1', answerId: 'a1', targetQuestionId: 'q3' }
    act(() => {
      result.current.addBranchingRule(rule)
    })
    expect(result.current.survey.branchingRules).toHaveLength(1)
    expect(result.current.survey.branchingRules[0]).toEqual(rule)
  })

  it('deleteBranchingRule removes the rule by id', () => {
    const { result } = renderHook(() => useSurvey(), { wrapper: SurveyProvider })
    const rule = { id: 'br1', sourceQuestionId: 'q1', answerId: 'a1', targetQuestionId: 'q3' }
    act(() => {
      result.current.addBranchingRule(rule)
    })
    act(() => {
      result.current.deleteBranchingRule('br1')
    })
    expect(result.current.survey.branchingRules).toHaveLength(0)
  })

  it('updateBranchingRule updates a field on the matching rule', () => {
    const { result } = renderHook(() => useSurvey(), { wrapper: SurveyProvider })
    const rule = { id: 'br1', sourceQuestionId: 'q1', answerId: 'a1', targetQuestionId: 'q3' }
    act(() => {
      result.current.addBranchingRule(rule)
    })
    act(() => {
      result.current.updateBranchingRule('br1', { targetQuestionId: 'q5' })
    })
    expect(result.current.survey.branchingRules[0].targetQuestionId).toBe('q5')
  })
})
