import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BranchingEditor from './BranchingEditor'

describe('BranchingEditor', () => {
  it('renders the branching section', () => {
    render(<BranchingEditor />)
    expect(screen.getByRole('region', { name: 'Branching rules' })).toBeInTheDocument()
  })
})
