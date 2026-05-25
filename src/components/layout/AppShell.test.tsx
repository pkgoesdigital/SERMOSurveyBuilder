import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppShell from './AppShell'
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

describe('AppShell', () => {
  it('renders children', () => {
    render(
      <Wrapper>
        <AppShell>
          <div>content</div>
        </AppShell>
      </Wrapper>,
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
