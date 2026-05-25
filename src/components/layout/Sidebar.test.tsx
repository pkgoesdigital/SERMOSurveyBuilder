import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from './Sidebar'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { SurveyProvider } from '../../contexts/SurveyContext'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <SurveyProvider>{children}</SurveyProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('Sidebar', () => {
  it('renders the questions nav region', () => {
    render(<Wrapper><Sidebar /></Wrapper>)
    expect(screen.getByRole('complementary', { name: 'Questions' })).toBeInTheDocument()
  })
})
