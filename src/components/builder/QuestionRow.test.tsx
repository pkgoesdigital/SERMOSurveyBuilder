import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionRow from './QuestionRow'
import { singleSelect } from '../../question-types/single-select'

describe('QuestionRow', () => {
  const q = { ...singleSelect.defaultQuestion(), text: 'Favourite color?' }

  it('renders the question text', () => {
    render(<QuestionRow question={q} index={0} isActive={false} onSelect={() => {}} />)
    expect(screen.getByText('Favourite color?')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn()
    render(<QuestionRow question={q} index={0} isActive={false} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledOnce()
  })
})
