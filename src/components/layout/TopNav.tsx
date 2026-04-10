import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search, Circle as HelpCircle } from 'lucide-react'
import { mockPredictions } from '../../data/mockData'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Your health overview at a glance' },
  '/upload': { title: 'Upload Documents', subtitle: 'Add medical records, reports, and prescriptions' },
  '/history': { title: 'Medical History', subtitle: 'Complete record of conditions, medications, and procedures' },
  '/timeline': { title: 'Health Timeline', subtitle: 'Chronological view of your medical journey' },
  '/bodymap': { title: 'Body Map', subtitle: 'Interactive symptom and condition mapping' },
  '/predictions': { title: 'Health Predictions', subtitle: 'AI-powered risk alerts and recommendations' },
  '/sharing': { title: 'Record Sharing', subtitle: 'Securely share your health data with providers' },
  '/settings': { title: 'Settings', subtitle: 'Account and platform preferences' },
}

const urgentAlerts = mockPredictions.filter(p => p.urgency === 'high' || p.urgency === 'critical')

export function TopNav() {
  const location = useLocation()
  const page = pageTitles[location.pathname] || { title: 'MediRecord', subtitle: '' }

  return (
    <header style={{
      height: 'var(--topnav-height)',
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      background: 'white',
      borderBottom: '1px solid var(--neutral-200)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      zIndex: 90,
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--neutral-900)', letterSpacing: '-0.3px' }}>{page.title}</h1>
        <p style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 1 }}>{page.subtitle}</p>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--neutral-50)',
        border: '1px solid var(--neutral-200)',
        borderRadius: 8,
        padding: '6px 12px',
        width: 240,
      }}>
        <Search size={14} color="var(--neutral-400)" />
        <input
          type="text"
          placeholder="Search records, conditions..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 13,
            color: 'var(--neutral-700)',
            width: '100%',
          }}
        />
      </div>

      <div style={{ position: 'relative' }}>
        <button style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: '1px solid var(--neutral-200)',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}>
          <Bell size={16} color="var(--neutral-500)" />
        </button>
        {urgentAlerts.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 16,
            height: 16,
            background: 'var(--error-500)',
            borderRadius: '50%',
            fontSize: 10,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            border: '2px solid white',
          }}>
            {urgentAlerts.length}
          </span>
        )}
      </div>

      <button style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: '1px solid var(--neutral-200)',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <HelpCircle size={16} color="var(--neutral-500)" />
      </button>
    </header>
  )
}
