import { useState } from 'react'
import ThemeToggle from '../shared/ThemeToggle'
import SurveyTitleInput from '../builder/SurveyTitleInput'
import { useSurvey } from '../../contexts/SurveyContext'
import { storage } from '../../lib/storage'

type SaveState = 'idle' | 'saving' | 'saved'

export default function Toolbar() {
  const { survey } = useSurvey()
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const handleSave = async () => {
    setSaveState('saving')
    await storage.saveSurvey(survey)
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2000)
  }

  const saveLabel = saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved ✓' : 'Save'

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
            background: saveState === 'saved' ? 'var(--color-accent)' : 'var(--color-accent)',
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
        <ThemeToggle />
      </div>
    </header>
  )
}
