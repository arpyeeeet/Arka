import React from 'react'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'accent'

const variantStyles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  primary: { bg: 'var(--primary-50)', color: 'var(--primary-700)', border: 'var(--primary-100)' },
  success: { bg: 'var(--success-50)', color: 'var(--success-700)', border: 'var(--success-100)' },
  warning: { bg: 'var(--warning-50)', color: 'var(--warning-600)', border: 'var(--warning-100)' },
  error: { bg: 'var(--error-50)', color: 'var(--error-700)', border: 'var(--error-100)' },
  neutral: { bg: 'var(--neutral-100)', color: 'var(--neutral-600)', border: 'var(--neutral-200)' },
  accent: { bg: 'var(--accent-50)', color: 'var(--accent-600)', border: 'var(--accent-100)' },
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  style?: React.CSSProperties
}

export function Badge({ children, variant = 'neutral', style }: BadgeProps) {
  const vs = variantStyles[variant]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: vs.bg,
      color: vs.color,
      border: `1px solid ${vs.border}`,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  )
}
