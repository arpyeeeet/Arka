import React from 'react'

const colors = {
  active: 'var(--success-500)',
  chronic: 'var(--warning-500)',
  resolved: 'var(--neutral-400)',
  normal: 'var(--success-500)',
  abnormal: 'var(--warning-500)',
  critical: 'var(--error-500)',
  stopped: 'var(--neutral-400)',
  completed: 'var(--neutral-400)',
}

interface StatusDotProps {
  status: string
  label?: string
}

export function StatusDot({ status, label }: StatusDotProps) {
  const color = colors[status as keyof typeof colors] || 'var(--neutral-400)'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        flexShrink: 0,
      }} />
      {label && <span style={{ fontSize: 12, color: 'var(--neutral-600)', textTransform: 'capitalize' }}>{label || status}</span>}
    </span>
  )
}
