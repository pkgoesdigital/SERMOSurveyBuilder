import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import BranchingEditor from './BranchingEditor'
import { SurveyProvider, useSurvey } from '../../contexts/SurveyContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { singleSelect } from '../../question-types/single-select'
import { numeric } from '../../question-types/numeric'
import type { Question } from '../../lib/types'

function Harness({ questions, activeId }: { questions: Question[]; activeId?: string }) {
  const { addQuestion, setActiveQuestionId } = useSurvey()
  useEffect(() => {
    questions.forEach((q) => addQuestion(q))
    if (activeId) setActiveQuestionId(activeId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <BranchingEditor />
}

function renderEditor(questions: Question[], activeId?: string) {
  render(
    <ThemeProvider>
      <SurveyProvider>
        <Harness questions={questions} activeId={activeId} />
      </SurveyProvider>
    </ThemeProvider>,
  )
}

describe('BranchingEditor', () => {
  it('renders the branching section', async () => {
    const q1 = singleSelect.defaultQuestion()
    const q2 = singleSelect.defaultQuestion()
    renderEditor([q1, q2], q1.id)
    await waitFor(() =>
      expect(screen.getByRole('region', { name: 'Branching rules' })).toBeInTheDocument(),
    )
  })

  it('shows "Add answer options" for questions without options (numeric)', async () => {
    const q = numeric.defaultQuestion()
    renderEditor([q], q.id)
    await waitFor(() =>
      expect(screen.getByText(/add answer options/i)).toBeInTheDocument(),
    )
  })

  it('shows "No rules yet" for single-select with no rules', async () => {
    const q1 = singleSelect.defaultQuestion()
    const q2 = singleSelect.defaultQuestion()
    renderEditor([q1, q2], q1.id)
    await waitFor(() =>
      expect(screen.getByText(/no rules yet/i)).toBeInTheDocument(),
    )
  })

  it('"Add rule" button is disabled when only one question exists', async () => {
    const q = singleSelect.defaultQuestion()
    renderEditor([q], q.id)
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /add branching rule/i })).toBeDisabled(),
    )
  })

  it('clicking "Add rule" reveals the answer and target dropdowns', async () => {
    const q1 = singleSelect.defaultQuestion()
    const q2 = singleSelect.defaultQuestion()
    renderEditor([q1, q2], q1.id)

    await waitFor(() => screen.getByRole('button', { name: /add branching rule/i }))
    fireEvent.click(screen.getByRole('button', { name: /add branching rule/i }))

    expect(screen.getByRole('combobox', { name: /if answer is/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /skip to question/i })).toBeInTheDocument()
  })

  it('cancelling the add form hides the dropdowns', async () => {
    const q1 = singleSelect.defaultQuestion()
    const q2 = singleSelect.defaultQuestion()
    renderEditor([q1, q2], q1.id)

    await waitFor(() => screen.getByRole('button', { name: /add branching rule/i }))
    fireEvent.click(screen.getByRole('button', { name: /add branching rule/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByRole('combobox', { name: /if answer is/i })).not.toBeInTheDocument()
  })
})
