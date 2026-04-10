import React, { useState } from 'react'
import { Share2, Link2, Copy, Check, CircleUser as UserCircle, Building, Heart, Shield, ChevronRight, Eye, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import type { SharePermissions } from '../types'

interface SharedRecord {
  id: string
  name: string
  type: 'doctor' | 'hospital' | 'caregiver'
  permissions: SharePermissions
  expires?: string
  created: string
  token: string
}

const mockShared: SharedRecord[] = [
  {
    id: 's1',
    name: 'Dr. Michael Roberts',
    type: 'doctor',
    permissions: { conditions: true, medications: true, documents: true, timeline: true, tests: true },
    expires: '2025-06-01',
    created: '2024-12-01',
    token: 'med-xxxx-1234',
  },
  {
    id: 's2',
    name: 'City General Hospital',
    type: 'hospital',
    permissions: { conditions: true, medications: true, documents: false, timeline: false, tests: true },
    created: '2024-11-15',
    token: 'med-xxxx-5678',
  },
]

const typeIcons = {
  doctor: UserCircle,
  hospital: Building,
  caregiver: Heart,
}

const typeLabels = {
  doctor: 'Doctor',
  hospital: 'Hospital',
  caregiver: 'Caregiver',
}

const permissionLabels: Record<keyof SharePermissions, string> = {
  conditions: 'Conditions',
  medications: 'Medications',
  documents: 'Documents',
  timeline: 'Timeline',
  tests: 'Lab Tests',
}

function PermissionToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px 14px',
        borderRadius: 8,
        border: `1px solid ${value ? 'var(--primary-200)' : 'var(--neutral-200)'}`,
        background: value ? 'var(--primary-50)' : 'var(--neutral-50)',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: 13, color: value ? 'var(--primary-700)' : 'var(--neutral-600)', fontWeight: value ? 500 : 400 }}>{label}</span>
      <div style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: value ? 'var(--primary-500)' : 'var(--neutral-300)',
        position: 'relative',
        transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute',
          top: 2,
          left: value ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </button>
  )
}

function SharedRecordRow({ record, onRevoke }: { record: SharedRecord; onRevoke: () => void }) {
  const [copied, setCopied] = useState(false)
  const Icon = typeIcons[record.type]

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const grantedCount = Object.values(record.permissions).filter(Boolean).length

  return (
    <div style={{
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: 'var(--primary-50)',
        border: '1px solid var(--primary-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color="var(--primary-600)" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--neutral-800)' }}>{record.name}</span>
          <Badge variant="primary">{typeLabels[record.type]}</Badge>
        </div>
        <div style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 4 }}>
          {grantedCount} of 5 data types shared · Since {new Date(record.created).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          {record.expires && ` · Expires ${new Date(record.expires).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {(Object.keys(record.permissions) as (keyof SharePermissions)[]).map(key => (
            record.permissions[key] && (
              <Badge key={key} variant="neutral" style={{ fontSize: 10 }}>{permissionLabels[key]}</Badge>
            )
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 12px',
            borderRadius: 7,
            border: '1px solid var(--neutral-200)',
            background: 'white',
            fontSize: 12,
            color: 'var(--neutral-600)',
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={12} color="var(--success-500)" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy Link'}
        </button>
        <button
          onClick={onRevoke}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 10px',
            borderRadius: 7,
            border: '1px solid var(--error-100)',
            background: 'var(--error-50)',
            fontSize: 12,
            color: 'var(--error-600)',
            cursor: 'pointer',
          }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

export function Sharing() {
  const [sharedRecords, setSharedRecords] = useState(mockShared)
  const [shareType, setShareType] = useState<'doctor' | 'hospital' | 'caregiver'>('doctor')
  const [recipientName, setRecipientName] = useState('')
  const [permissions, setPermissions] = useState<SharePermissions>({
    conditions: true, medications: true, documents: false, timeline: false, tests: true,
  })
  const [generated, setGenerated] = useState(false)

  const generateLink = () => {
    if (!recipientName.trim()) return
    const newRecord: SharedRecord = {
      id: `s${Date.now()}`,
      name: recipientName,
      type: shareType,
      permissions,
      created: new Date().toISOString().split('T')[0],
      token: `med-xxxx-${Math.floor(Math.random() * 9000 + 1000)}`,
    }
    setSharedRecords(prev => [newRecord, ...prev])
    setGenerated(true)
    setRecipientName('')
    setTimeout(() => setGenerated(false), 3000)
  }

  const revokeAccess = (id: string) => {
    setSharedRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="fade-in" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardHeader title="Create Share Link" icon={<Link2 size={15} color="var(--primary-600)" />} subtitle="Grant secure access to your records" />
          <CardBody>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-600)', display: 'block', marginBottom: 8 }}>Share With</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {(['doctor', 'hospital', 'caregiver'] as const).map(type => {
                  const Icon = typeIcons[type]
                  return (
                    <button
                      key={type}
                      onClick={() => setShareType(type)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        padding: '12px 8px',
                        borderRadius: 8,
                        border: `1px solid ${shareType === type ? 'var(--primary-300)' : 'var(--neutral-200)'}`,
                        background: shareType === type ? 'var(--primary-50)' : 'var(--neutral-50)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Icon size={20} color={shareType === type ? 'var(--primary-600)' : 'var(--neutral-400)'} />
                      <span style={{ fontSize: 12, color: shareType === type ? 'var(--primary-700)' : 'var(--neutral-500)', fontWeight: shareType === type ? 600 : 400 }}>
                        {typeLabels[type]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-600)', display: 'block', marginBottom: 8 }}>
                {typeLabels[shareType]} Name
              </label>
              <input
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder={`Enter ${typeLabels[shareType].toLowerCase()} name...`}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--neutral-200)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-600)', display: 'block', marginBottom: 8 }}>
                Data Permissions
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(Object.keys(permissions) as (keyof SharePermissions)[]).map(key => (
                  <PermissionToggle
                    key={key}
                    label={permissionLabels[key]}
                    value={permissions[key]}
                    onChange={(v) => setPermissions(prev => ({ ...prev, [key]: v }))}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={generateLink}
              disabled={!recipientName.trim()}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 8,
                border: 'none',
                background: recipientName.trim() ? 'var(--primary-600)' : 'var(--neutral-200)',
                color: recipientName.trim() ? 'white' : 'var(--neutral-400)',
                fontSize: 14,
                fontWeight: 600,
                cursor: recipientName.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {generated ? <Check size={16} /> : <Link2 size={16} />}
              {generated ? 'Share Link Created!' : 'Generate Secure Share Link'}
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Security & Privacy" icon={<Shield size={15} color="var(--success-600)" />} />
          <CardBody>
            {[
              { title: 'End-to-end encrypted', description: 'All shared data is encrypted in transit and at rest' },
              { title: 'Revocable at any time', description: 'You can immediately revoke access from any recipient' },
              { title: 'Audit trail', description: 'Every access to your records is logged and timestamped' },
              { title: 'Permission scoped', description: 'Recipients can only view data you explicitly grant access to' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--neutral-50)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--success-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Check size={11} color="var(--success-600)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>{item.description}</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader
            title="Active Shares"
            icon={<Share2 size={15} color="var(--primary-600)" />}
            subtitle={`${sharedRecords.length} active access grants`}
          />
          {sharedRecords.length === 0 ? (
            <CardBody style={{ padding: '40px 24px', textAlign: 'center' }}>
              <Share2 size={32} color="var(--neutral-200)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: 14, color: 'var(--neutral-500)' }}>No active share links</p>
            </CardBody>
          ) : (
            <div>
              {sharedRecords.map((record, i) => (
                <div key={record.id} style={{ borderBottom: i < sharedRecords.length - 1 ? '1px solid var(--neutral-100)' : 'none' }}>
                  <SharedRecordRow record={record} onRevoke={() => revokeAccess(record.id)} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
