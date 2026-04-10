import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Upload, ClipboardList, Clock, User,
  Brain, Share2, Settings, Heart, ChevronRight
} from 'lucide-react'
import { mockPatient } from '../../data/mockData'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Documents', icon: Upload },
  { to: '/history', label: 'Medical History', icon: ClipboardList },
  { to: '/timeline', label: 'Timeline', icon: Clock },
  { to: '/bodymap', label: 'Body Map', icon: User },
  { to: '/predictions', label: 'Predictions', icon: Brain },
  { to: '/sharing', label: 'Sharing', icon: Share2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'white',
      borderRight: '1px solid var(--neutral-200)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid var(--neutral-100)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'var(--primary-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Heart size={18} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--neutral-900)', letterSpacing: '-0.3px' }}>MediRecord</div>
          <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 1 }}>Health Intelligence</div>
        </div>
      </div>

      <div style={{
        padding: '12px 12px 8px',
        borderBottom: '1px solid var(--neutral-100)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, paddingLeft: 4 }}>
          Active Patient
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 8,
          background: 'var(--primary-50)',
          cursor: 'pointer',
          border: '1px solid var(--primary-100)',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--primary-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--primary-700)',
            flexShrink: 0,
          }}>
            {mockPatient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {mockPatient.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--neutral-500)' }}>
              {mockPatient.age}y · {mockPatient.blood_group}
            </div>
          </div>
          <ChevronRight size={14} color="var(--neutral-400)" />
        </div>
      </div>

      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 7,
              marginBottom: 2,
              color: isActive ? 'var(--primary-700)' : 'var(--neutral-600)',
              background: isActive ? 'var(--primary-50)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: 13.5,
              transition: 'all 0.15s ease',
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} color={isActive ? 'var(--primary-600)' : 'var(--neutral-500)'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--neutral-100)',
        fontSize: 11,
        color: 'var(--neutral-400)',
        textAlign: 'center',
      }}>
        v1.0 · Medical Grade
      </div>
    </aside>
  )
}
