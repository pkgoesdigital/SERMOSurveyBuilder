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

  it('calls onMoveUp when up button is clicked', async () => {
    const onMoveUp = vi.fn()
    render(
      <QuestionRow
        question={q}
        index={1}
        isActive={false}
        onSelect={() => {}}
        onDelete={() => {}}
        onMoveUp={onMoveUp}
      />,
    )
    await userEvent.hover(screen.getByRole('row'))
    await userEvent.click(screen.getByLabelText('Move question 2 up'))
    expect(onMoveUp).toHaveBeenCalledOnce()
  })

  it('calls onMoveDown when down button is clicked', async () => {
    const onMoveDown = vi.fn()
    render(
      <QuestionRow
        question={q}
        index={0}
        isActive={false}
        onSelect={() => {}}
        onDelete={() => {}}
        onMoveDown={onMoveDown}
      />,
    )
    await userEvent.hover(screen.getByRole('row'))
    await userEvent.click(screen.getByLabelText('Move question 1 down'))
    expect(onMoveDown).toHaveBeenCalledOnce()
  })

  it('up button is disabled when onMoveUp is not provided', () => {
    render(<QuestionRow question={q} index={0} isActive={false} onSelect={() => {}} onDelete={() => {}} />)
    expect(screen.getByLabelText('Move question 1 up')).toBeDisabled()
  })

  it('down button is disabled when onMoveDown is not provided', () => {
    render(<QuestionRow question={q} index={0} isActive={false} onSelect={() => {}} onDelete={() => {}} />)
    expect(screen.getByLabelText('Move question 1 down')).toBeDisabled()
  })
})
