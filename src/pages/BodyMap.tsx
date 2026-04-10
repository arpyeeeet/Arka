import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

interface RegionSymptom {
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
}

interface BodyRegionData {
  id: string
  label: string
  conditions: string[]
  symptoms: RegionSymptom[]
}

const initialRegions: Record<string, BodyRegionData> = {
  head: { id: 'head', label: 'Head & Brain', conditions: [], symptoms: [{ symptom: 'Occasional headaches', severity: 'mild', date: '2024-10-01' }] },
  chest: { id: 'chest', label: 'Chest & Heart', conditions: ['Hypertension', 'Mild LVH'], symptoms: [{ symptom: 'Exertional dyspnea', severity: 'mild', date: '2024-09-15' }] },
  abdomen: { id: 'abdomen', label: 'Abdomen', conditions: ['GERD', 'Type 2 Diabetes (pancreas)'], symptoms: [{ symptom: 'Acid reflux after meals', severity: 'moderate', date: '2024-11-01' }] },
  back: { id: 'back', label: 'Back & Spine', conditions: [], symptoms: [] },
  arms: { id: 'arms', label: 'Arms & Hands', conditions: [], symptoms: [] },
  legs: { id: 'legs', label: 'Legs & Feet', conditions: [], symptoms: [] },
  lungs: { id: 'lungs', label: 'Lungs', conditions: ['Mild Persistent Asthma'], symptoms: [{ symptom: 'Wheeze on exertion', severity: 'mild', date: '2024-08-20' }] },
}

const severityColor = { mild: 'var(--success-500)', moderate: 'var(--warning-500)', severe: 'var(--error-500)' }
const severityBg = { mild: 'var(--success-50)', moderate: 'var(--warning-50)', severe: 'var(--error-50)' }

interface BodyPartProps {
  regionId: string
  label: string
  path: string
  transform?: string
  active: boolean
  hasData: boolean
  onClick: () => void
}

function BodyPartSvg({ regionId, path, active, hasData, onClick, label }: BodyPartProps) {
  const [hovered, setHovered] = useState(false)
  const fill = active ? '#2563eb' : hovered ? '#bfdbfe' : hasData ? '#dbeafe' : '#f1f5f9'
  const stroke = active ? '#1d4ed8' : hasData ? '#93c5fd' : '#e2e8f0'

  return (
    <g
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
      aria-label={label}
    >
      <path d={path} fill={fill} stroke={stroke} strokeWidth={1.5} style={{ transition: 'fill 0.2s, stroke 0.2s' }} />
      {hasData && !active && (
        <circle
          cx={parseInt(path.match(/M(\d+)/)?.[1] || '0') + 15}
          cy={parseInt(path.match(/M\d+,(\d+)/)?.[1] || '0') + 5}
          r={4}
          fill="#2563eb"
          opacity={0.8}
        />
      )}
    </g>
  )
}

function HumanBodySVG({ activeRegion, regions, onRegionClick }: {
  activeRegion: string | null
  regions: Record<string, BodyRegionData>
  onRegionClick: (id: string) => void
}) {
  const hasData = (id: string) => {
    const r = regions[id]
    return r && (r.conditions.length > 0 || r.symptoms.length > 0)
  }

  return (
    <svg viewBox="0 0 200 480" width="100%" height="100%" style={{ maxHeight: 480 }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Head */}
      <g onClick={() => onRegionClick('head')} style={{ cursor: 'pointer' }}
        onMouseEnter={e => (e.currentTarget.querySelector('ellipse')!.style.fill = activeRegion === 'head' ? '#2563eb' : '#bfdbfe')}
        onMouseLeave={e => (e.currentTarget.querySelector('ellipse')!.style.fill = activeRegion === 'head' ? '#2563eb' : hasData('head') ? '#dbeafe' : '#f1f5f9')}>
        <ellipse cx="100" cy="42" rx="30" ry="36"
          fill={activeRegion === 'head' ? '#2563eb' : hasData('head') ? '#dbeafe' : '#f1f5f9'}
          stroke={activeRegion === 'head' ? '#1d4ed8' : hasData('head') ? '#93c5fd' : '#e2e8f0'}
          strokeWidth="1.5"
          style={{ transition: 'fill 0.2s' }} />
        <text x="100" y="46" textAnchor="middle" fontSize="9" fill={activeRegion === 'head' ? 'white' : '#64748b'} fontWeight="500">Head</text>
      </g>

      {/* Neck */}
      <rect x="90" y="75" width="20" height="20" rx="4"
        fill={activeRegion === 'head' ? '#93c5fd' : '#f1f5f9'}
        stroke="#e2e8f0" strokeWidth="1" />

      {/* Torso/Chest/Abdomen */}
      <g>
        {/* Chest */}
        <g onClick={() => onRegionClick('chest')} style={{ cursor: 'pointer' }}
          onMouseEnter={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'chest' ? '#2563eb' : '#bfdbfe' }}
          onMouseLeave={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'chest' ? '#2563eb' : hasData('chest') ? '#dbeafe' : '#f1f5f9' }}>
          <rect x="65" y="94" width="70" height="80" rx="6"
            fill={activeRegion === 'chest' ? '#2563eb' : hasData('chest') ? '#dbeafe' : '#f1f5f9'}
            stroke={activeRegion === 'chest' ? '#1d4ed8' : hasData('chest') ? '#93c5fd' : '#e2e8f0'}
            strokeWidth="1.5"
            style={{ transition: 'fill 0.2s' }} />
          <text x="100" y="134" textAnchor="middle" fontSize="9" fill={activeRegion === 'chest' ? 'white' : '#64748b'} fontWeight="500">Chest</text>
        </g>

        {/* Lungs markers */}
        <g onClick={() => onRegionClick('lungs')} style={{ cursor: 'pointer' }}>
          <ellipse cx="82" cy="118" rx="10" ry="14"
            fill={activeRegion === 'lungs' ? '#2563eb' : hasData('lungs') ? '#dbeafe' : 'rgba(255,255,255,0.7)'}
            stroke={hasData('lungs') ? '#93c5fd' : '#e2e8f0'}
            strokeWidth="1.5"
            style={{ transition: 'fill 0.2s' }} />
          <ellipse cx="118" cy="118" rx="10" ry="14"
            fill={activeRegion === 'lungs' ? '#2563eb' : hasData('lungs') ? '#dbeafe' : 'rgba(255,255,255,0.7)'}
            stroke={hasData('lungs') ? '#93c5fd' : '#e2e8f0'}
            strokeWidth="1.5"
            style={{ transition: 'fill 0.2s' }} />
          <text x="100" y="152" textAnchor="middle" fontSize="7" fill={activeRegion === 'lungs' ? 'white' : '#94a3b8'}>Lungs</text>
        </g>

        {/* Abdomen */}
        <g onClick={() => onRegionClick('abdomen')} style={{ cursor: 'pointer' }}
          onMouseEnter={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'abdomen' ? '#2563eb' : '#bfdbfe' }}
          onMouseLeave={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'abdomen' ? '#2563eb' : hasData('abdomen') ? '#dbeafe' : '#f1f5f9' }}>
          <rect x="65" y="172" width="70" height="70" rx="6"
            fill={activeRegion === 'abdomen' ? '#2563eb' : hasData('abdomen') ? '#dbeafe' : '#f1f5f9'}
            stroke={activeRegion === 'abdomen' ? '#1d4ed8' : hasData('abdomen') ? '#93c5fd' : '#e2e8f0'}
            strokeWidth="1.5"
            style={{ transition: 'fill 0.2s' }} />
          <text x="100" y="212" textAnchor="middle" fontSize="9" fill={activeRegion === 'abdomen' ? 'white' : '#64748b'} fontWeight="500">Abdomen</text>
        </g>
      </g>

      {/* Left Arm */}
      <g onClick={() => onRegionClick('arms')} style={{ cursor: 'pointer' }}
        onMouseEnter={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'arms' ? '#2563eb' : '#bfdbfe' }}
        onMouseLeave={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'arms' ? '#2563eb' : hasData('arms') ? '#dbeafe' : '#f1f5f9' }}>
        <rect x="28" y="100" width="36" height="130" rx="14"
          fill={activeRegion === 'arms' ? '#2563eb' : hasData('arms') ? '#dbeafe' : '#f1f5f9'}
          stroke={activeRegion === 'arms' ? '#1d4ed8' : '#e2e8f0'}
          strokeWidth="1.5"
          style={{ transition: 'fill 0.2s' }} />
      </g>

      {/* Right Arm */}
      <g onClick={() => onRegionClick('arms')} style={{ cursor: 'pointer' }}
        onMouseEnter={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'arms' ? '#2563eb' : '#bfdbfe' }}
        onMouseLeave={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'arms' ? '#2563eb' : hasData('arms') ? '#dbeafe' : '#f1f5f9' }}>
        <rect x="136" y="100" width="36" height="130" rx="14"
          fill={activeRegion === 'arms' ? '#2563eb' : hasData('arms') ? '#dbeafe' : '#f1f5f9'}
          stroke={activeRegion === 'arms' ? '#1d4ed8' : '#e2e8f0'}
          strokeWidth="1.5"
          style={{ transition: 'fill 0.2s' }} />
        <text x="154" y="172" textAnchor="middle" fontSize="8" fill={activeRegion === 'arms' ? 'white' : '#94a3b8'}>Arms</text>
      </g>

      {/* Left Leg */}
      <g onClick={() => onRegionClick('legs')} style={{ cursor: 'pointer' }}
        onMouseEnter={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'legs' ? '#2563eb' : '#bfdbfe' }}
        onMouseLeave={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'legs' ? '#2563eb' : hasData('legs') ? '#dbeafe' : '#f1f5f9' }}>
        <rect x="67" y="244" width="34" height="180" rx="14"
          fill={activeRegion === 'legs' ? '#2563eb' : hasData('legs') ? '#dbeafe' : '#f1f5f9'}
          stroke={activeRegion === 'legs' ? '#1d4ed8' : '#e2e8f0'}
          strokeWidth="1.5"
          style={{ transition: 'fill 0.2s' }} />
      </g>

      {/* Right Leg */}
      <g onClick={() => onRegionClick('legs')} style={{ cursor: 'pointer' }}
        onMouseEnter={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'legs' ? '#2563eb' : '#bfdbfe' }}
        onMouseLeave={e => { const r = e.currentTarget.querySelector('rect'); if(r) r.style.fill = activeRegion === 'legs' ? '#2563eb' : hasData('legs') ? '#dbeafe' : '#f1f5f9' }}>
        <rect x="99" y="244" width="34" height="180" rx="14"
          fill={activeRegion === 'legs' ? '#2563eb' : hasData('legs') ? '#dbeafe' : '#f1f5f9'}
          stroke={activeRegion === 'legs' ? '#1d4ed8' : '#e2e8f0'}
          strokeWidth="1.5"
          style={{ transition: 'fill 0.2s' }} />
        <text x="100" y="360" textAnchor="middle" fontSize="8" fill={activeRegion === 'legs' ? 'white' : '#94a3b8'}>Legs</text>
      </g>

      {/* Data indicators */}
      {Object.entries(regions).map(([id, region]) => {
        if (region.conditions.length === 0 && region.symptoms.length === 0) return null
        const positions: Record<string, [number, number]> = {
          head: [126, 22], chest: [128, 98], lungs: [128, 110], abdomen: [128, 176],
          arms: [160, 98], legs: [128, 248],
        }
        const pos = positions[id]
        if (!pos) return null
        return (
          <circle key={id} cx={pos[0]} cy={pos[1]} r={5} fill="#2563eb" opacity={0.9} />
        )
      })}
    </svg>
  )
}

export function BodyMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>('chest')
  const [regions, setRegions] = useState(initialRegions)
  const [showAddSymptom, setShowAddSymptom] = useState(false)
  const [newSymptom, setNewSymptom] = useState<{ symptom: string; severity: 'mild' | 'moderate' | 'severe' }>({ symptom: '', severity: 'mild' })

  const selectedRegion = activeRegion ? regions[activeRegion] : null

  const addSymptom = () => {
    if (!activeRegion || !newSymptom.symptom.trim()) return
    setRegions(prev => ({
      ...prev,
      [activeRegion]: {
        ...prev[activeRegion],
        symptoms: [...prev[activeRegion].symptoms, { ...newSymptom, date: new Date().toISOString().split('T')[0] }]
      }
    }))
    setNewSymptom({ symptom: '', severity: 'mild' })
    setShowAddSymptom(false)
  }

  const regionList = [
    { id: 'head', label: 'Head' },
    { id: 'chest', label: 'Chest' },
    { id: 'lungs', label: 'Lungs' },
    { id: 'abdomen', label: 'Abdomen' },
    { id: 'arms', label: 'Arms' },
    { id: 'legs', label: 'Legs' },
    { id: 'back', label: 'Back' },
  ]

  return (
    <div className="fade-in" style={{ padding: 24, display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        <Card>
          <CardHeader title="Body Map" subtitle="Click region to explore" />
          <CardBody style={{ display: 'flex', justifyContent: 'center', padding: '20px 16px' }}>
            <HumanBodySVG
              activeRegion={activeRegion}
              regions={regions}
              onRegionClick={(id) => setActiveRegion(id === activeRegion ? null : id)}
            />
          </CardBody>
        </Card>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {regionList.map(r => {
            const data = regions[r.id]
            const total = (data?.conditions.length || 0) + (data?.symptoms.length || 0)
            return (
              <button
                key={r.id}
                onClick={() => setActiveRegion(r.id === activeRegion ? null : r.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: activeRegion === r.id ? 'var(--primary-200)' : 'var(--neutral-200)',
                  background: activeRegion === r.id ? 'var(--primary-50)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: activeRegion === r.id ? 600 : 400, color: activeRegion === r.id ? 'var(--primary-700)' : 'var(--neutral-600)', flex: 1 }}>{r.label}</span>
                {total > 0 && <Badge variant="primary">{total}</Badge>}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {selectedRegion ? (
          <>
            <Card>
              <CardHeader
                title={selectedRegion.label}
                action={
                  <button
                    onClick={() => setShowAddSymptom(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--primary-200)',
                      background: 'var(--primary-50)',
                      color: 'var(--primary-700)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    Add Symptom
                  </button>
                }
              />
              {showAddSymptom && (
                <div style={{
                  margin: '0 20px 12px',
                  padding: 16,
                  background: 'var(--primary-50)',
                  borderRadius: 8,
                  border: '1px solid var(--primary-100)',
                }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <input
                      value={newSymptom.symptom}
                      onChange={e => setNewSymptom(p => ({ ...p, symptom: e.target.value }))}
                      placeholder="Describe the symptom..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--primary-200)',
                        fontSize: 13,
                        outline: 'none',
                        background: 'white',
                      }}
                    />
                    <select
                      value={newSymptom.severity}
                      onChange={e => setNewSymptom(p => ({ ...p, severity: e.target.value as 'mild' | 'moderate' | 'severe' }))}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--primary-200)',
                        fontSize: 13,
                        background: 'white',
                        outline: 'none',
                      }}
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={addSymptom}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'var(--primary-600)',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddSymptom(false)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 8,
                        border: '1px solid var(--neutral-200)',
                        background: 'white',
                        color: 'var(--neutral-600)',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <CardBody style={{ padding: '8px 0 0' }}>
                {selectedRegion.conditions.length === 0 && selectedRegion.symptoms.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--neutral-400)', fontSize: 13 }}>
                    No conditions or symptoms recorded for this region
                  </div>
                ) : (
                  <>
                    {selectedRegion.conditions.length > 0 && (
                      <div style={{ padding: '0 0 12px' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '0 20px 8px' }}>
                          Conditions
                        </div>
                        {selectedRegion.conditions.map((c, i) => (
                          <div key={i} style={{ padding: '10px 20px', borderBottom: '1px solid var(--neutral-50)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning-500)', flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: 'var(--neutral-700)' }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedRegion.symptoms.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '0 20px 8px' }}>
                          Symptoms
                        </div>
                        {selectedRegion.symptoms.map((s, i) => (
                          <div key={i} style={{
                            padding: '12px 20px',
                            borderBottom: i < selectedRegion.symptoms.length - 1 ? '1px solid var(--neutral-50)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                          }}>
                            <div style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: severityColor[s.severity],
                              flexShrink: 0,
                            }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, color: 'var(--neutral-700)' }}>{s.symptom}</div>
                              <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>
                                {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                            <Badge variant={s.severity === 'mild' ? 'success' : s.severity === 'moderate' ? 'warning' : 'error'}>
                              {s.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Region Legend" subtitle="Data indicators" />
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { color: 'var(--primary-500)', bg: 'var(--primary-50)', label: 'Selected region' },
                    { color: 'var(--primary-300)', bg: 'var(--primary-50)', label: 'Has recorded data' },
                    { color: 'var(--neutral-300)', bg: 'var(--neutral-50)', label: 'No data recorded' },
                  ].map(({ color, bg, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 24, height: 14, borderRadius: 4, background: bg, border: `2px solid ${color}` }} />
                      <span style={{ fontSize: 12, color: 'var(--neutral-600)' }}>{label}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary-600)' }} />
                    <span style={{ fontSize: 12, color: 'var(--neutral-600)' }}>Data indicator dot</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        ) : (
          <Card>
            <CardBody style={{ padding: '60px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--neutral-600)', marginBottom: 8 }}>
                Select a Body Region
              </div>
              <div style={{ fontSize: 13, color: 'var(--neutral-400)', lineHeight: 1.6 }}>
                Click on any part of the body diagram or use the region list to view associated conditions, symptoms, and medical events
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
