import React, { useState } from 'react'
import { Activity, Pill, FileText, TestTube, Scissors, TriangleAlert as AlertTriangle, ChevronRight, X } from 'lucide-react'
import { Card, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { mockTimeline, mockConditions, mockMedications } from '../data/mockData'
import type { TimelineEvent } from '../types'

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string; badgeVariant: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'accent' }> = {
  condition: { icon: Activity, color: 'var(--error-600)', bg: 'var(--error-50)', label: 'Diagnosis', badgeVariant: 'error' },
  medication: { icon: Pill, color: 'var(--primary-600)', bg: 'var(--primary-50)', label: 'Medication', badgeVariant: 'primary' },
  document: { icon: FileText, color: 'var(--accent-600)', bg: 'var(--accent-50)', label: 'Document', badgeVariant: 'accent' },
  test: { icon: TestTube, color: 'var(--warning-600)', bg: 'var(--warning-50)', label: 'Test', badgeVariant: 'warning' },
  procedure: { icon: Scissors, color: 'var(--success-600)', bg: 'var(--success-50)', label: 'Procedure', badgeVariant: 'success' },
  alert: { icon: AlertTriangle, color: 'var(--error-600)', bg: 'var(--error-50)', label: 'Alert', badgeVariant: 'error' },
}

function EventDetailPanel({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  const cfg = typeConfig[event.type]
  const Icon = cfg.icon

  const relatedItems = event.type === 'condition'
    ? mockConditions.filter(c => c.name.toLowerCase().includes(event.title.toLowerCase().replace('diagnosed: ', '')))
    : event.type === 'medication'
    ? mockMedications.filter(m => event.title.toLowerCase().includes(m.name.toLowerCase()))
    : []

  return (
    <Card style={{ position: 'sticky', top: 80 }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--neutral-100)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--neutral-800)', lineHeight: 1.3 }}>{event.title}</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
          <X size={16} color="var(--neutral-400)" />
        </button>
      </div>
      <CardBody>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Date</div>
          <div style={{ fontSize: 14, color: 'var(--neutral-700)' }}>
            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {event.description && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Notes</div>
            <div style={{ fontSize: 13, color: 'var(--neutral-600)', lineHeight: 1.6 }}>{event.description}</div>
          </div>
        )}

        {relatedItems.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Related Record</div>
            {relatedItems.map(item => (
              <div key={item.id} style={{
                padding: '10px 14px',
                background: 'var(--neutral-50)',
                borderRadius: 8,
                border: '1px solid var(--neutral-100)',
                fontSize: 13,
              }}>
                {'icd_code' in item && (
                  <>
                    <div style={{ fontWeight: 500, color: 'var(--neutral-800)' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 4 }}>{item.icd_code} · {item.status}</div>
                  </>
                )}
                {'dosage' in item && (
                  <>
                    <div style={{ fontWeight: 500, color: 'var(--neutral-800)' }}>{item.name} {item.dosage}</div>
                    <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 4 }}>{item.frequency}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

function groupEventsByYear(events: TimelineEvent[]) {
  const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const groups: Record<string, TimelineEvent[]> = {}
  sorted.forEach(e => {
    const year = new Date(e.date).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(e)
  })
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
}

export function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const grouped = groupEventsByYear(
    filter === 'all' ? mockTimeline : mockTimeline.filter(e => e.type === filter)
  )

  const filters = [
    { key: 'all', label: 'All Events' },
    { key: 'condition', label: 'Diagnoses' },
    { key: 'medication', label: 'Medications' },
    { key: 'test', label: 'Tests' },
    { key: 'procedure', label: 'Procedures' },
    { key: 'document', label: 'Documents' },
  ]

  return (
    <div className="fade-in" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
      <div>
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

        {grouped.map(([year, events]) => (
          <div key={year} style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--neutral-200)',
                letterSpacing: '-1px',
                minWidth: 56,
              }}>{year}</div>
              <div style={{ flex: 1, height: 1, background: 'var(--neutral-100)' }} />
              <span style={{ fontSize: 11, color: 'var(--neutral-400)' }}>{events.length} events</span>
            </div>

            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{
                position: 'absolute',
                left: 11,
                top: 0,
                bottom: 0,
                width: 2,
                background: 'var(--neutral-100)',
              }} />

              {events.map((event) => {
                const cfg = typeConfig[event.type]
                const Icon = cfg.icon
                const isSelected = selectedEvent?.id === event.id

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(isSelected ? null : event)}
                    style={{
                      position: 'relative',
                      marginBottom: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      left: -21,
                      top: 14,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: isSelected ? cfg.color : cfg.bg,
                      border: `2px solid ${isSelected ? cfg.color : 'var(--neutral-100)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      zIndex: 1,
                    }}>
                      <Icon size={11} color={isSelected ? 'white' : cfg.color} />
                    </div>

                    <div style={{
                      background: 'white',
                      borderRadius: 10,
                      border: `1px solid ${isSelected ? cfg.color : 'var(--neutral-200)'}`,
                      padding: '12px 16px',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? `0 0 0 3px ${cfg.bg}` : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-800)', marginBottom: 4 }}>{event.title}</div>
                          {event.description && (
                            <div style={{ fontSize: 12, color: 'var(--neutral-500)', lineHeight: 1.5 }}>
                              {event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: 'var(--neutral-400)' }}>
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
                          <ChevronRight size={13} color={isSelected ? cfg.color : 'var(--neutral-300)'} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div>
        {selectedEvent ? (
          <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        ) : (
          <Card style={{ position: 'sticky', top: 80 }}>
            <CardBody style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: 'var(--neutral-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <Activity size={24} color="var(--neutral-300)" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--neutral-600)' }}>Select an Event</p>
              <p style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 6, lineHeight: 1.6 }}>
                Click any timeline event to view source documents, notes, and related data
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
