import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { TopNav } from './components/layout/TopNav'
import { Dashboard } from './pages/Dashboard'
import { UploadDocuments } from './pages/UploadDocuments'
import { MedicalHistory } from './pages/MedicalHistory'
import { Timeline } from './pages/Timeline'
import { BodyMap } from './pages/BodyMap'
import { Predictions } from './pages/Predictions'
import { Sharing } from './pages/Sharing'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <div style={{
          marginLeft: 'var(--sidebar-width)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <TopNav />
          <main style={{
            marginTop: 'var(--topnav-height)',
            flex: 1,
            overflowY: 'auto',
            background: 'var(--neutral-50)',
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadDocuments />} />
              <Route path="/history" element={<MedicalHistory />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/bodymap" element={<BodyMap />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/sharing" element={<Sharing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
