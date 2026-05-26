import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('shows 0% Complete when no questions answered', () => {
    render(<ProgressBar current={0} total={7} />)
    expect(screen.getByText('0% Complete')).toBeInTheDocument()
  })

  it('shows 100% Complete when all questions answered', () => {
    render(<ProgressBar current={7} total={7} />)
    expect(screen.getByText('100% Complete')).toBeInTheDocument()
  })

  it('rounds to nearest percent', () => {
    render(<ProgressBar current={1} total={3} />)
    expect(screen.getByText('33% Complete')).toBeInTheDocument()
  })

  it('sets aria-valuenow to the calculated percent', () => {
    render(<ProgressBar current={3} total={7} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '43')
  })

  it('shows 0% when total is 0', () => {
    render(<ProgressBar current={0} total={0} />)
    expect(screen.getByText('0% Complete')).toBeInTheDocument()
  })
})
