import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RespondentView from './RespondentView'
import { ThemeProvider } from '../../contexts/ThemeContext'
import type { Survey } from '../../lib/types'
import { generateId } from '../../lib/utils'

const emptySurvey: Survey = {
  id: generateId(),
  title: 'Test',
  questions: [],
  branchingRules: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('RespondentView', () => {
  it('shows thank-you message when survey has no questions', () => {
    render(
      <ThemeProvider>
        <RespondentView survey={emptySurvey} />
      </ThemeProvider>,
    )
    expect(screen.getByText(/thank you/i)).toBeInTheDocument()
  })
})
