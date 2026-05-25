import { useState } from 'react'
import ThemeToggle from '../shared/ThemeToggle'
import SurveyTitleInput from '../builder/SurveyTitleInput'
import { useSurvey } from '../../contexts/SurveyContext'
import { storage } from '../../lib/storage'
import { encodeSurveyForShare } from '../../lib/export'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type ShareState = 'idle' | 'copied'

export default function Toolbar() {
  const { survey } = useSurvey()
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [shareState, setShareState] = useState<ShareState>('idle')

  const handleSave = async () => {
    setSaveState('saving')
    try {
      await storage.saveSurvey(survey)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
    setTimeout(() => setSaveState('idle'), 2000)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/respond?survey=${encodeSurveyForShare(survey)}`
    try {
      await navigator.clipboard.writeText(url)
      setShareState('copied')
      setTimeout(() => setShareState('idle'), 2000)
    } catch {
      // Clipboard may be blocked (non-HTTPS, permissions) — fall back to prompt.
      window.prompt('Copy this link to share the survey:', url)
    }
  }

  const saveLabel =
    saveState === 'saving' ? 'Saving…' :
    saveState === 'saved'  ? 'Saved ✓' :
    saveState === 'error'  ? 'Save failed' :
    'Save'
  const shareLabel = shareState === 'copied' ? 'Copied ✓' : 'Share'

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saveState === 'saving'}
          aria-label="Save survey"
          style={{
            padding: '0 18px',
            minHeight: 44,
            minWidth: 80,
            borderRadius: 8,
            border: 'none',
            background: saveState === 'error' ? '#ef4444' : 'var(--color-accent)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: saveState === 'saving' ? 'default' : 'pointer',
            opacity: saveState === 'saving' ? 0.6 : 1,
            transition: 'opacity 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {saveLabel}
        </button>
        <button
          onClick={handleShare}
          disabled={survey.questions.length === 0}
          aria-label="Share survey link"
          title={survey.questions.length === 0 ? 'Add at least one question to share' : 'Copy a shareable link'}
          style={{
            padding: '0 18px',
            minHeight: 44,
            minWidth: 80,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: 14,
            fontWeight: 500,
            cursor: survey.questions.length === 0 ? 'not-allowed' : 'pointer',
            opacity: survey.questions.length === 0 ? 0.5 : 1,
            transition: 'opacity 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {shareLabel}
        </button>
        <ThemeToggle />
      </div>
    </header>
  )
}
