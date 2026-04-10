import React, { useState } from 'react'
import { User, Bell, Shield, Database, Palette, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { mockPatient } from '../data/mockData'

export function Settings() {
  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    labResults: true,
    riskAlerts: true,
    shareActivity: false,
  })

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 800 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardHeader title="Profile Information" icon={<User size={15} color="var(--primary-600)" />} />
          <CardBody>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Full Name', value: mockPatient.name },
                { label: 'Date of Birth', value: mockPatient.date_of_birth },
                { label: 'Gender', value: mockPatient.gender },
                { label: 'Blood Group', value: mockPatient.blood_group },
                { label: 'Phone', value: mockPatient.phone || '—' },
                { label: 'Email', value: mockPatient.email || '—' },
              ].map(field => (
                <div key={field.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    {field.label}
                  </div>
                  <div style={{
                    padding: '9px 14px',
                    background: 'var(--neutral-50)',
                    borderRadius: 8,
                    border: '1px solid var(--neutral-200)',
                    fontSize: 14,
                    color: 'var(--neutral-700)',
                  }}>
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Notification Preferences" icon={<Bell size={15} color="var(--primary-600)" />} />
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { key: 'medicationReminders', label: 'Medication Reminders', description: 'Daily reminders for active medications' },
                { key: 'labResults', label: 'Lab Result Alerts', description: 'Notify when test results are uploaded or available' },
                { key: 'riskAlerts', label: 'Health Risk Alerts', description: 'AI-powered risk notifications and warnings' },
                { key: 'shareActivity', label: 'Share Activity', description: 'Notify when recipients access your shared records' },
              ].map(({ key, label, description }) => (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--neutral-50)',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--neutral-800)' }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 2 }}>{description}</div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: notifications[key as keyof typeof notifications] ? 'var(--primary-500)' : 'var(--neutral-300)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 2,
                      left: notifications[key as keyof typeof notifications] ? 22 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'white',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Data & Privacy" icon={<Shield size={15} color="var(--primary-600)" />} />
          <CardBody>
            {[
              { label: 'Export Health Data', description: 'Download all your medical records as JSON or PDF', action: 'Export' },
              { label: 'Delete All Data', description: 'Permanently remove all medical records from the system', action: 'Delete', danger: true },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid var(--neutral-50)',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--neutral-800)' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 2 }}>{item.description}</div>
                </div>
                <button style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: `1px solid ${item.danger ? 'var(--error-200)' : 'var(--neutral-200)'}`,
                  background: item.danger ? 'var(--error-50)' : 'var(--neutral-50)',
                  color: item.danger ? 'var(--error-600)' : 'var(--neutral-600)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}>
                  {item.action}
                </button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="System" icon={<Database size={15} color="var(--primary-600)" />} />
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Platform Version', value: 'v1.0.0' },
                { label: 'Database', value: 'Supabase (PostgreSQL)' },
                { label: 'Data Encryption', value: 'AES-256' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: 'var(--neutral-600)' }}>{item.label}</span>
                  <Badge variant="neutral">{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
