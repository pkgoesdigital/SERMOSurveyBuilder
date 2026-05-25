import ThemeToggle from '../shared/ThemeToggle'
import SurveyTitleInput from '../builder/SurveyTitleInput'

export default function Toolbar() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: 56,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        flexShrink: 0,
      }}
    >
      <SurveyTitleInput />
      <ThemeToggle />
    </header>
  )
}
