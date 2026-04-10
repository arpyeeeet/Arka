import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: number | string
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 4, style }: SkeletonProps) {
  return (
    <div
      className="animate-pulse"
      style={{
        width,
        height,
        borderRadius,
        background: 'var(--neutral-100)',
        ...style,
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div style={{ padding: 20, background: 'white', borderRadius: 12, border: '1px solid var(--neutral-200)' }}>
      <Skeleton width="60%" height={16} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={12} />
    </div>
  )
}
