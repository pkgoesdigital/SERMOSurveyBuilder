interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Question ${current} of ${total}`}
      style={{
        width: '100%',
        height: 4,
        background: 'var(--color-border)',
      }}
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
  )
}
