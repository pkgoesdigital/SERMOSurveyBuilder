import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      style={{
        minWidth: 44,
        minHeight: 44,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 14px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 9999,
        cursor: 'pointer',
        color: 'var(--color-text)',
        fontSize: 14,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      {isDark ? '☀️' : '🌙'}
      <span>Light/Dark Mode</span>
    </button>
  )
}
