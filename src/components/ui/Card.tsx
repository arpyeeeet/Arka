import React from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, style, onClick, hoverable = false }: CardProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--neutral-200)',
        boxShadow: hovered && hoverable ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s ease, transform 0.15s ease',
        transform: hovered && hoverable ? 'translateY(-1px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px 12px',
      borderBottom: '1px solid var(--neutral-100)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--primary-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </div>
        )}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--neutral-800)' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function CardBody({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ padding: '16px 20px', ...style }}>
      {children}
    </div>
  )
}
