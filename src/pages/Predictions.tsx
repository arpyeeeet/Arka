import React, { useState } from 'react'
import { TriangleAlert as AlertTriangle, TrendingUp, Bell, ChevronRight, CircleCheck as CheckCircle, Info } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { mockPredictions } from '../data/mockData'
import type { Prediction } from '../types'

const urgencyConfig = {
  critical: { color: 'var(--error-700)', bg: 'var(--error-50)', border: 'var(--error-200)', label: 'Critical', badgeVariant: 'error' as const },
  high: { color: 'var(--error-600)', bg: 'var(--error-50)', border: 'var(--error-100)', label: 'High Risk', badgeVariant: 'error' as const },
  medium: { color: 'var(--warning-600)', bg: 'var(--warning-50)', border: 'var(--warning-100)', label: 'Medium', badgeVariant: 'warning' as const },
  low: { color: 'var(--success-600)', bg: 'var(--success-50)', border: 'var(--success-100)', label: 'Low', badgeVariant: 'success' as const },
}

const typeIcon = {
  risk: AlertTriangle,
  conflict: TrendingUp,
  reminder: Bell,
}

function RiskScoreMeter({ score }: { score: number }) {
  const angle = (score / 100) * 180
  const color = score >= 70 ? 'var(--error-500)' : score >= 40 ? 'var(--warning-500)' : 'var(--success-500)'
  const r = 40
  const cx = 60
  const cy = 55
  const startAngle = 180
  const endAngle = startAngle + angle

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startAngle))
  const y1 = cy + r * Math.sin(toRad(startAngle))
  const x2 = cx + r * Math.cos(toRad(endAngle))
  const y2 = cy + r * Math.sin(toRad(endAngle))
  const largeArc = angle > 180 ? 1 : 0

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="120" height="70" viewBox="0 0 120 70">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--neutral-100)" strokeWidth="8" strokeLinecap="round" />
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>{score}</text>
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="8" fill="var(--neutral-400)">/ 100</text>
      </svg>
    </div>
  )
}

function PredictionCard({ prediction }: { prediction: Prediction }) {
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const cfg = urgencyConfig[prediction.urgency]
  const Icon = typeIcon[prediction.type]

  if (dismissed) return null

  return (
    <Card
      hoverable
      style={{ border: `1px solid ${cfg.border}`, overflow: 'hidden' }}
    >
      <div style={{ height: 3, background: cfg.color, width: '100%' }} />
      <CardBody style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: cfg.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={18} color={cfg.color} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
                  <span style={{ fontSize: 10, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {prediction.type}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--neutral-800)', letterSpacing: '-0.2px', lineHeight: 1.3 }}>
                  {prediction.title}
                </h3>
              </div>
              {prediction.risk_score !== undefined && (
                <RiskScoreMeter score={prediction.risk_score} />
              )}
            </div>

            <p style={{ fontSize: 13, color: 'var(--neutral-600)', marginTop: 8, lineHeight: 1.6 }}>
              {prediction.description}
            </p>

            {expanded && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
                  Recommended Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {prediction.actions.map((action, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      background: 'var(--neutral-50)',
                      borderRadius: 8,
                      border: '1px solid var(--neutral-100)',
                    }}>
                      <CheckCircle size={14} color="var(--success-500)" />
                      <span style={{ fontSize: 13, color: 'var(--neutral-700)' }}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: `1px solid ${cfg.border}`,
                  background: cfg.bg,
                  color: cfg.color,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {expanded ? 'Hide Actions' : 'View Actions'}
                <ChevronRight size={13} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <button
                onClick={() => setDismissed(true)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--neutral-200)',
                  background: 'white',
                  color: 'var(--neutral-500)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function SummaryBar() {
  const counts = {
    critical: mockPredictions.filter(p => p.urgency === 'critical').length,
    high: mockPredictions.filter(p => p.urgency === 'high').length,
    medium: mockPredictions.filter(p => p.urgency === 'medium').length,
    low: mockPredictions.filter(p => p.urgency === 'low').length,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
      {[
        { label: 'Critical', count: counts.critical, color: 'var(--error-700)', bg: 'var(--error-50)', border: 'var(--error-200)' },
        { label: 'High Risk', count: counts.high, color: 'var(--error-600)', bg: 'var(--error-50)', border: 'var(--error-100)' },
        { label: 'Medium', count: counts.medium, color: 'var(--warning-600)', bg: 'var(--warning-50)', border: 'var(--warning-100)' },
        { label: 'Low Priority', count: counts.low, color: 'var(--success-600)', bg: 'var(--success-50)', border: 'var(--success-100)' },
      ].map(stat => (
        <div key={stat.label} style={{
          padding: '16px 20px',
          background: stat.bg,
          borderRadius: 12,
          border: `1px solid ${stat.border}`,
        }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: stat.color, letterSpacing: '-1px' }}>{stat.count}</div>
          <div style={{ fontSize: 12, color: stat.color, marginTop: 4, opacity: 0.8 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export function Predictions() {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? mockPredictions
    : mockPredictions.filter(p => p.urgency === filter || p.type === filter)

  const filters = [
    { key: 'all', label: 'All Alerts' },
    { key: 'critical', label: 'Critical' },
    { key: 'high', label: 'High Risk' },
    { key: 'medium', label: 'Medium' },
    { key: 'risk', label: 'Risk Alerts' },
    { key: 'conflict', label: 'Drug Conflicts' },
    { key: 'reminder', label: 'Reminders' },
  ]

  return (
    <div className="fade-in" style={{ padding: 24 }}>
      <SummaryBar />

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: filter === f.key ? 'var(--primary-300)' : 'var(--neutral-200)',
              background: filter === f.key ? 'var(--primary-50)' : 'white',
              color: filter === f.key ? 'var(--primary-700)' : 'var(--neutral-500)',
              fontSize: 12,
              fontWeight: filter === f.key ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.length === 0 ? (
            <Card>
              <CardBody style={{ padding: '48px 32px', textAlign: 'center' }}>
                <CheckCircle size={40} color="var(--success-400)" style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--neutral-600)' }}>No alerts in this category</p>
              </CardBody>
            </Card>
          ) : (
            filtered.map(p => <PredictionCard key={p.id} prediction={p} />)
          )}
        </div>

        <div style={{ width: 280, flexShrink: 0 }}>
          <Card style={{ position: 'sticky', top: 80 }}>
            <CardHeader title="Health Score" subtitle="Overall risk assessment" />
            <CardBody>
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--warning-500)', letterSpacing: '-2px', lineHeight: 1 }}>62</div>
                <div style={{ fontSize: 13, color: 'var(--neutral-500)', marginTop: 8 }}>out of 100</div>
                <div style={{ marginTop: 16, height: 8, background: 'var(--neutral-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: '62%',
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--success-400), var(--warning-400))',
                    borderRadius: 4,
                  }} />
                </div>
                <Badge variant="warning" style={{ marginTop: 12 }}>Needs Attention</Badge>
              </div>

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Glycemic Control', score: 78, color: 'var(--success-500)' },
                  { label: 'Cardiovascular', score: 55, color: 'var(--warning-500)' },
                  { label: 'Renal Health', score: 72, color: 'var(--success-500)' },
                  { label: 'Medication Adherence', score: 90, color: 'var(--success-600)' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--neutral-600)' }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.score}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--neutral-100)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${item.score}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 16,
                padding: '10px 12px',
                background: 'var(--primary-50)',
                borderRadius: 8,
                border: '1px solid var(--primary-100)',
                display: 'flex',
                gap: 8,
              }}>
                <Info size={14} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: 'var(--primary-700)', lineHeight: 1.5 }}>
                  Scores are AI estimates based on your medical records. Always consult your physician.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
