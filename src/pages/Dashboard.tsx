import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, TriangleAlert as AlertTriangle, FileText, Pill, TrendingUp, Calendar, Clock, ChevronRight, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { StatusDot } from '../components/ui/StatusDot'
import {
  mockPatient, mockConditions, mockMedications, mockDocuments,
  mockPredictions, mockTests, bloodSugarTrend, bloodPressureTrend
} from '../data/mockData'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts'

function PatientOverviewCard() {
  return (
    <Card style={{ gridColumn: 'span 2' }}>
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 700,
          color: 'white',
          flexShrink: 0,
        }}>
          {mockPatient.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', letterSpacing: '-0.4px' }}>{mockPatient.name}</h2>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{mockPatient.age} years old</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>·</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{mockPatient.gender}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>·</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Blood Group: <strong>{mockPatient.blood_group}</strong></span>
          </div>
        </div>
      </div>
      <CardBody>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Allergies</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {mockPatient.allergies.map(a => (
                <Badge key={a} variant="error">{a}</Badge>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Chronic Conditions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {mockPatient.chronic_conditions.map(c => (
                <Badge key={c} variant="warning">{c}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
          {[
            { label: 'Active Conditions', value: mockConditions.filter(c => c.status !== 'resolved').length, color: 'var(--warning-600)' },
            { label: 'Current Medications', value: mockMedications.filter(m => m.status === 'active').length, color: 'var(--primary-600)' },
            { label: 'Recent Documents', value: mockDocuments.length, color: 'var(--accent-600)' },
            { label: 'Risk Alerts', value: mockPredictions.filter(p => p.urgency === 'high' || p.urgency === 'critical').length, color: 'var(--error-600)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--neutral-50)',
              borderRadius: 8,
              padding: '12px 14px',
              border: '1px solid var(--neutral-100)',
            }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: stat.color, letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'var(--neutral-500)', marginTop: 3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

function ActiveConditionsList() {
  const active = mockConditions.filter(c => c.status !== 'resolved').slice(0, 4)
  return (
    <Card>
      <CardHeader
        title="Active Conditions"
        icon={<Activity size={15} color="var(--primary-600)" />}
        action={<span style={{ fontSize: 12, color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }}>View All</span>}
      />
      <CardBody style={{ padding: '8px 0 0' }}>
        {active.map((c, i) => (
          <div key={c.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 20px',
            borderBottom: i < active.length - 1 ? '1px solid var(--neutral-50)' : 'none',
          }}>
            <StatusDot status={c.status} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>
                {c.icd_code} · Since {new Date(c.diagnosed_date).getFullYear()}
              </div>
            </div>
            <Badge variant={c.status === 'chronic' ? 'warning' : 'success'}>{c.status}</Badge>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

function MedicationSummary() {
  const active = mockMedications.filter(m => m.status === 'active').slice(0, 5)
  return (
    <Card>
      <CardHeader
        title="Current Medications"
        icon={<Pill size={15} color="var(--primary-600)" />}
        action={<span style={{ fontSize: 12, color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }}>View All</span>}
      />
      <CardBody style={{ padding: '8px 0 0' }}>
        {active.map((m, i) => (
          <div key={m.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 20px',
            borderBottom: i < active.length - 1 ? '1px solid var(--neutral-50)' : 'none',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--primary-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Pill size={14} color="var(--primary-600)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{m.name} <span style={{ fontWeight: 400, color: 'var(--neutral-500)' }}>{m.dosage}</span></div>
              <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>{m.frequency}</div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

function RecentAlerts() {
  const alerts = mockPredictions.slice(0, 3)
  const urgencyColors: Record<string, string> = {
    high: 'var(--error-500)',
    medium: 'var(--warning-500)',
    low: 'var(--success-500)',
    critical: 'var(--error-700)',
  }
  return (
    <Card>
      <CardHeader
        title="Health Alerts"
        icon={<AlertTriangle size={15} color="var(--error-500)" />}
        action={<Badge variant="error">{mockPredictions.filter(p => p.urgency === 'high').length} High</Badge>}
      />
      <CardBody style={{ padding: '8px 0 0' }}>
        {alerts.map((p, i) => (
          <div key={p.id} style={{
            padding: '12px 20px',
            borderBottom: i < alerts.length - 1 ? '1px solid var(--neutral-50)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: urgencyColors[p.urgency], marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--neutral-500)', marginTop: 3, lineHeight: 1.5 }}>
                  {p.description.substring(0, 80)}...
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

function TestTrends() {
  return (
    <Card>
      <CardHeader
        title="Blood Sugar Trend (2024)"
        icon={<TrendingUp size={15} color="var(--primary-600)" />}
        subtitle="HbA1c %"
      />
      <CardBody>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={bloodSugarTrend} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorHba1c" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-100)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--neutral-400)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--neutral-400)' }} axisLine={false} tickLine={false} domain={[6, 8.5]} />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid var(--neutral-200)', borderRadius: 8, fontSize: 12 }}
              formatter={(value) => [`${value}%`, 'HbA1c']}
            />
            <Area type="monotone" dataKey="hba1c" stroke="var(--primary-500)" strokeWidth={2} fill="url(#colorHba1c)" dot={{ fill: 'var(--primary-500)', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 0', borderTop: '1px solid var(--neutral-100)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success-600)' }}>6.8%</div>
            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>Current HbA1c</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-600)' }}>↓ 1.0%</div>
            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>YTD Improvement</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success-600)' }}>On Target</div>
            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>Goal: &lt; 7.0%</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function BPTrend() {
  return (
    <Card>
      <CardHeader
        title="Blood Pressure Trend (2024)"
        icon={<Activity size={15} color="var(--error-500)" />}
        subtitle="mmHg"
      />
      <CardBody>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={bloodPressureTrend} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-100)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--neutral-400)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--neutral-400)' }} axisLine={false} tickLine={false} domain={[70, 155]} />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid var(--neutral-200)', borderRadius: 8, fontSize: 12 }}
            />
            <Line type="monotone" dataKey="systolic" stroke="var(--error-500)" strokeWidth={2} dot={{ fill: 'var(--error-500)', r: 3 }} name="Systolic" />
            <Line type="monotone" dataKey="diastolic" stroke="var(--accent-500)" strokeWidth={2} dot={{ fill: 'var(--accent-500)', r: 3 }} name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 0', borderTop: '1px solid var(--neutral-100)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--warning-600)' }}>128/82</div>
            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>Latest Reading</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-600)' }}>↓ 14/8</div>
            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>YTD Reduction</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--warning-600)' }}>Stage 1</div>
            <div style={{ fontSize: 11, color: 'var(--neutral-400)' }}>Classification</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function RecentDocuments() {
  return (
    <Card>
      <CardHeader
        title="Recent Documents"
        icon={<FileText size={15} color="var(--primary-600)" />}
        action={<span style={{ fontSize: 12, color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }}>Upload New</span>}
      />
      <CardBody style={{ padding: '8px 0 0' }}>
        {mockDocuments.map((d, i) => (
          <div key={d.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            borderBottom: i < mockDocuments.length - 1 ? '1px solid var(--neutral-50)' : 'none',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: d.status === 'parsed' ? 'var(--success-50)' : 'var(--neutral-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {d.status === 'parsed'
                ? <CheckCircle size={16} color="var(--success-600)" />
                : <XCircle size={16} color="var(--neutral-400)" />
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{d.title}</div>
              <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>
                {new Date(d.upload_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {d.type.toUpperCase()}
              </div>
            </div>
            <Badge variant={d.status === 'parsed' ? 'success' : 'neutral'}>{d.status}</Badge>
            <ChevronRight size={14} color="var(--neutral-300)" />
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

function UpcomingFollowups() {
  const followups = [
    { date: 'Jan 15, 2025', title: '3-month HbA1c Check', doctor: 'Dr. Emily Chen', type: 'Lab Test' },
    { date: 'Feb 10, 2025', title: 'BP Follow-up Visit', doctor: 'Dr. Michael Roberts', type: 'Consultation' },
    { date: 'Mar 20, 2025', title: 'Annual Eye Exam', doctor: 'Dr. Sarah Lee', type: 'Screening' },
  ]
  return (
    <Card>
      <CardHeader
        title="Upcoming Follow-ups"
        icon={<Calendar size={15} color="var(--accent-600)" />}
      />
      <CardBody style={{ padding: '8px 0 0' }}>
        {followups.map((f, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 20px',
            borderBottom: i < followups.length - 1 ? '1px solid var(--neutral-50)' : 'none',
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'var(--accent-50)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid var(--accent-100)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-600)', lineHeight: 1 }}>
                {f.date.split(' ')[1].replace(',', '')}
              </span>
              <span style={{ fontSize: 9, color: 'var(--accent-500)', marginTop: 2 }}>
                {f.date.split(' ')[0].toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{f.title}</div>
              <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>{f.doctor} · {f.type}</div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export function Dashboard() {
  return (
    <div className="fade-in" style={{ padding: 24 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}>
        <PatientOverviewCard />
        <RecentAlerts />
        <TestTrends />
        <BPTrend />
        <ActiveConditionsList />
        <MedicationSummary />
        <RecentDocuments />
        <UpcomingFollowups />
      </div>
    </div>
  )
}
