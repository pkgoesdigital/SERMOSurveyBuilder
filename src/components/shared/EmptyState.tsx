export default function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 12,
        color: 'var(--color-text-muted)',
      }}
    >
      <p style={{ fontSize: 16 }}>No question selected</p>
      <p style={{ fontSize: 14 }}>Add a question from the sidebar to get started.</p>
    </div>
  )
}
