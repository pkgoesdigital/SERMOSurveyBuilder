import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionRow from './QuestionRow'
import { singleSelect } from '../../question-types/single-select'

describe('QuestionRow', () => {
  const q = { ...singleSelect.defaultQuestion(), text: 'Favourite color?' }

  it('renders the question text', () => {
    render(<QuestionRow question={q} index={0} isActive={false} onSelect={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Favourite color?')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn()
    render(<QuestionRow question={q} index={0} isActive={false} onSelect={onSelect} onDelete={() => {}} />)
    await userEvent.click(screen.getByLabelText('Question 1: Favourite color?'))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('calls onDelete when trash button is clicked', async () => {
    const onDelete = vi.fn()
    render(<QuestionRow question={q} index={0} isActive={false} onSelect={() => {}} onDelete={onDelete} />)
    await userEvent.hover(screen.getByRole('row'))
    await userEvent.click(screen.getByLabelText('Delete question 1'))
    expect(onDelete).toHaveBeenCalledOnce()
  })
})
