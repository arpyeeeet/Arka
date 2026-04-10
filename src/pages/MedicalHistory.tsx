import React, { useState } from 'react'
import { Search, ListFilter as Filter, ChevronDown } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { StatusDot } from '../components/ui/StatusDot'
import { mockConditions, mockMedications, mockTests } from '../data/mockData'

type Tab = 'conditions' | 'medications' | 'tests'

function TabButton({ label, active, count, onClick }: { label: string; active: boolean; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        background: 'none',
        border: 'none',
        borderBottom: active ? '2px solid var(--primary-600)' : '2px solid transparent',
        color: active ? 'var(--primary-700)' : 'var(--neutral-500)',
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.15s',
        marginBottom: '-1px',
      }}
    >
      {label}
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '1px 7px',
        borderRadius: 10,
        background: active ? 'var(--primary-100)' : 'var(--neutral-100)',
        color: active ? 'var(--primary-700)' : 'var(--neutral-500)',
      }}>
        {count}
      </span>
    </button>
  )
}

function ConditionsTable({ search }: { search: string }) {
  const filtered = mockConditions.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.icd_code && c.icd_code.toLowerCase().includes(search.toLowerCase()))
  )

  const statusVariant = (s: string) => s === 'active' ? 'success' : s === 'chronic' ? 'warning' : 'neutral'

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        padding: '10px 20px',
        background: 'var(--neutral-50)',
        borderBottom: '1px solid var(--neutral-200)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--neutral-500)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        <span>Condition</span>
        <span>ICD Code</span>
        <span>Since</span>
        <span>Status</span>
      </div>
      {filtered.map((c, i) => (
        <div key={c.id} style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '14px 20px',
          borderBottom: i < filtered.length - 1 ? '1px solid var(--neutral-50)' : 'none',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{c.name}</div>
            {c.notes && <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 3 }}>{c.notes}</div>}
          </div>
          <span style={{ fontSize: 12, color: 'var(--neutral-500)', fontFamily: 'monospace' }}>{c.icd_code || '—'}</span>
          <span style={{ fontSize: 12, color: 'var(--neutral-600)' }}>
            {new Date(c.diagnosed_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <Badge variant={statusVariant(c.status) as 'success' | 'warning' | 'neutral'}>{c.status}</Badge>
        </div>
      ))}
    </div>
  )
}

function MedicationsTable({ search }: { search: string }) {
  const filtered = mockMedications.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.frequency.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = (s: string) => s === 'active' ? 'success' : 'neutral'

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr',
        padding: '10px 20px',
        background: 'var(--neutral-50)',
        borderBottom: '1px solid var(--neutral-200)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--neutral-500)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        <span>Medication</span>
        <span>Dosage</span>
        <span>Frequency</span>
        <span>Started</span>
        <span>Status</span>
      </div>
      {filtered.map((m, i) => (
        <div key={m.id} style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr',
          padding: '14px 20px',
          borderBottom: i < filtered.length - 1 ? '1px solid var(--neutral-50)' : 'none',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{m.name}</div>
            {m.prescribed_by && <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 3 }}>By {m.prescribed_by}</div>}
          </div>
          <span style={{ fontSize: 12, color: 'var(--neutral-600)' }}>{m.dosage}</span>
          <span style={{ fontSize: 12, color: 'var(--neutral-600)' }}>{m.frequency}</span>
          <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
            {new Date(m.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <Badge variant={statusVariant(m.status) as 'success' | 'neutral'}>{m.status}</Badge>
        </div>
      ))}
    </div>
  )
}

function TestsTable({ search }: { search: string }) {
  const filtered = mockTests.filter(t =>
    t.test_name.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = (s: string) => s === 'normal' ? 'success' : s === 'abnormal' ? 'warning' : 'error'

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
        padding: '10px 20px',
        background: 'var(--neutral-50)',
        borderBottom: '1px solid var(--neutral-200)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--neutral-500)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        <span>Test Name</span>
        <span>Result</span>
        <span>Date</span>
        <span>Reference Range</span>
        <span>Status</span>
      </div>
      {filtered.map((t, i) => (
        <div key={t.id} style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr',
          padding: '14px 20px',
          borderBottom: i < filtered.length - 1 ? '1px solid var(--neutral-50)' : 'none',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{t.test_name}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.status === 'normal' ? 'var(--success-600)' : 'var(--warning-600)' }}>
            {t.value} <span style={{ fontWeight: 400, fontSize: 11, color: 'var(--neutral-400)' }}>{t.unit}</span>
          </span>
          <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
            {new Date(t.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span style={{ fontSize: 11, color: 'var(--neutral-400)' }}>{t.reference_range}</span>
          <Badge variant={statusVariant(t.status) as 'success' | 'warning' | 'error'}>{t.status}</Badge>
        </div>
      ))}
    </div>
  )
}

export function MedicalHistory() {
  const [activeTab, setActiveTab] = useState<Tab>('conditions')
  const [search, setSearch] = useState('')

  return (
    <div className="fade-in" style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {[
          { key: 'conditions', label: 'Conditions', count: mockConditions.length },
          { key: 'medications', label: 'Medications', count: mockMedications.length },
          { key: 'tests', label: 'Lab Tests', count: mockTests.length },
        ].map(({ key, label, count }) => (
          <div key={key} style={{
            flex: 1,
            padding: '16px 20px',
            background: 'white',
            borderRadius: 12,
            border: activeTab === key ? '1px solid var(--primary-200)' : '1px solid var(--neutral-200)',
            cursor: 'pointer',
            boxShadow: activeTab === key ? '0 0 0 3px var(--primary-50)' : 'none',
            transition: 'all 0.2s',
          }} onClick={() => setActiveTab(key as Tab)}>
            <div style={{ fontSize: 28, fontWeight: 700, color: activeTab === key ? 'var(--primary-600)' : 'var(--neutral-700)', letterSpacing: '-1px' }}>{count}</div>
            <div style={{ fontSize: 13, color: 'var(--neutral-500)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ borderBottom: '1px solid var(--neutral-200)', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <TabButton label="Conditions" active={activeTab === 'conditions'} count={mockConditions.length} onClick={() => setActiveTab('conditions')} />
            <TabButton label="Medications" active={activeTab === 'medications'} count={mockMedications.length} onClick={() => setActiveTab('medications')} />
            <TabButton label="Lab Tests" active={activeTab === 'tests'} count={mockTests.length} onClick={() => setActiveTab('tests')} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--neutral-50)',
              border: '1px solid var(--neutral-200)',
              borderRadius: 8,
              padding: '6px 12px',
            }}>
              <Search size={13} color="var(--neutral-400)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: 160, color: 'var(--neutral-700)' }}
              />
            </div>
          </div>
        </div>

        {activeTab === 'conditions' && <ConditionsTable search={search} />}
        {activeTab === 'medications' && <MedicationsTable search={search} />}
        {activeTab === 'tests' && <TestsTable search={search} />}
      </Card>
    </div>
  )
}
