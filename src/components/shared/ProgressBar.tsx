interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 16px 6px' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.02em',
          }}
          aria-live="polite"
        >
          {pct}% Complete
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% complete`}
        style={{ width: '100%', height: 4, background: 'var(--color-border)' }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'var(--color-accent)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
