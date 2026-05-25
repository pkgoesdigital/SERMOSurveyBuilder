import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from './ThemeToggle'
import { ThemeProvider } from '../../contexts/ThemeContext'

describe('ThemeToggle', () => {
  it('renders a switch button', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('toggles aria-checked on click', async () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    const btn = screen.getByRole('switch')
    expect(btn).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-checked', 'true')
  })
})
