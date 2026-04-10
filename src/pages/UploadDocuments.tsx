import React, { useState, useRef } from 'react'
import { Upload, FileText, Image, File, CircleCheck as CheckCircle, X, ChevronRight, CircleAlert as AlertCircle, Loader, Stethoscope, Pill, TestTube, BookOpen, Calendar } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import type { Document } from '../types'
import { mockDocuments } from '../data/mockData'

type UploadStatus = 'idle' | 'uploading' | 'extracting' | 'parsed' | 'error'

const sectionIcons = {
  diagnosis: Stethoscope,
  medications: Pill,
  tests: TestTube,
  advice: BookOpen,
  followups: Calendar,
}

function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 90 ? 'var(--success-500)' : value >= 70 ? 'var(--warning-500)' : 'var(--error-500)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--neutral-100)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 36 }}>{value}%</span>
    </div>
  )
}

function StatusStep({ status, current, label }: { status: UploadStatus; current: UploadStatus; label: string }) {
  const steps: UploadStatus[] = ['uploading', 'extracting', 'parsed']
  const stepIdx = steps.indexOf(status)
  const currentIdx = steps.indexOf(current)
  const isDone = currentIdx > stepIdx
  const isActive = currentIdx === stepIdx

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: isDone ? 'var(--success-500)' : isActive ? 'var(--primary-500)' : 'var(--neutral-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.3s',
      }}>
        {isDone ? (
          <CheckCircle size={14} color="white" />
        ) : isActive ? (
          <Loader size={12} color="white" className="animate-spin" />
        ) : (
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'block' }} />
        )}
      </div>
      <span style={{ fontSize: 13, color: isDone || isActive ? 'var(--neutral-800)' : 'var(--neutral-400)', fontWeight: isActive ? 600 : 400 }}>
        {label}
      </span>
    </div>
  )
}

function DropZone({ onFile }: { onFile: (file: File) => void }) {
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${drag ? 'var(--primary-400)' : 'var(--neutral-200)'}`,
        borderRadius: 12,
        padding: '48px 32px',
        textAlign: 'center',
        cursor: 'pointer',
        background: drag ? 'var(--primary-50)' : 'var(--neutral-50)',
        transition: 'all 0.2s ease',
      }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" hidden onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]) }} />
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 12,
        background: drag ? 'var(--primary-100)' : 'white',
        border: '1px solid var(--neutral-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        transition: 'all 0.2s',
      }}>
        <Upload size={24} color={drag ? 'var(--primary-600)' : 'var(--neutral-400)'} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--neutral-700)' }}>
        {drag ? 'Drop your file here' : 'Drag & drop medical documents'}
      </p>
      <p style={{ fontSize: 13, color: 'var(--neutral-400)', marginTop: 6 }}>
        Supports PDF, PNG, JPG, and TXT files
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        {[{ icon: FileText, label: 'PDF' }, { icon: Image, label: 'Image' }, { icon: File, label: 'Text' }].map(({ icon: Icon, label }) => (
          <div key={label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 20,
            background: 'white',
            border: '1px solid var(--neutral-200)',
            fontSize: 12,
            color: 'var(--neutral-500)',
          }}>
            <Icon size={12} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function ExtractedDataPanel({ doc }: { doc: Document }) {
  if (!doc.extracted_data) return null
  const data = doc.extracted_data

  const sections = [
    { key: 'diagnosis', label: 'Diagnosis', icon: sectionIcons.diagnosis, variant: 'error' as const },
    { key: 'medications', label: 'Medications', icon: sectionIcons.medications, variant: 'primary' as const },
    { key: 'tests', label: 'Test Results', icon: sectionIcons.tests, variant: 'accent' as const },
    { key: 'advice', label: 'Medical Advice', icon: sectionIcons.advice, variant: 'success' as const },
    { key: 'followups', label: 'Follow-ups', icon: sectionIcons.followups, variant: 'warning' as const },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.confidence !== undefined && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--success-50)',
          borderRadius: 8,
          border: '1px solid var(--success-100)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <CheckCircle size={16} color="var(--success-600)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success-700)' }}>Extraction Complete</div>
            <div style={{ marginTop: 4 }}>
              <ConfidenceMeter value={data.confidence} />
            </div>
          </div>
        </div>
      )}

      {data.doctor && (
        <div style={{ fontSize: 12, color: 'var(--neutral-500)', padding: '0 4px' }}>
          <strong>Physician:</strong> {data.doctor} &nbsp;·&nbsp; <strong>Date:</strong> {data.date}
        </div>
      )}

      {sections.map(({ key, label, icon: Icon, variant }) => {
        const items = data[key as keyof typeof data] as string[] | undefined
        if (!items?.length) return null
        return (
          <div key={key} style={{
            background: 'white',
            borderRadius: 8,
            border: '1px solid var(--neutral-200)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: 'var(--neutral-50)',
              borderBottom: '1px solid var(--neutral-100)',
            }}>
              <Icon size={14} color="var(--neutral-600)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-700)' }}>{label}</span>
              <Badge variant={variant} style={{ marginLeft: 'auto' }}>{items.length}</Badge>
            </div>
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  fontSize: 12,
                  color: 'var(--neutral-700)',
                  padding: '6px 10px',
                  background: 'var(--neutral-50)',
                  borderRadius: 6,
                  borderLeft: '3px solid var(--neutral-200)',
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function UploadDocuments() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeDoc, setActiveDoc] = useState<Document | null>(null)

  const handleFile = (file: File) => {
    setSelectedFile(file)
    setActiveDoc(null)
    setUploadStatus('uploading')

    setTimeout(() => {
      setUploadStatus('extracting')
      setTimeout(() => {
        setUploadStatus('parsed')
        setActiveDoc(mockDocuments[0])
      }, 2200)
    }, 1200)
  }

  return (
    <div className="fade-in" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card>
          <CardHeader title="Upload Medical Document" icon={<Upload size={15} color="var(--primary-600)" />} />
          <CardBody>
            {uploadStatus === 'idle' ? (
              <DropZone onFile={handleFile} />
            ) : (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'var(--neutral-50)',
                  borderRadius: 8,
                  border: '1px solid var(--neutral-200)',
                  marginBottom: 20,
                }}>
                  <FileText size={20} color="var(--primary-600)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{selectedFile?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>
                      {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
                    </div>
                  </div>
                  <button
                    onClick={() => { setUploadStatus('idle'); setSelectedFile(null); setActiveDoc(null) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
                  >
                    <X size={16} color="var(--neutral-400)" />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <StatusStep status="uploading" current={uploadStatus} label="Uploading document..." />
                  <StatusStep status="extracting" current={uploadStatus} label="Extracting medical data..." />
                  <StatusStep status="parsed" current={uploadStatus} label="Parsing complete" />
                </div>

                {uploadStatus !== 'parsed' && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{
                      height: 4,
                      background: 'var(--neutral-100)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: uploadStatus === 'uploading' ? '35%' : uploadStatus === 'extracting' ? '70%' : '100%',
                        background: 'var(--primary-500)',
                        borderRadius: 2,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 8, textAlign: 'center' }}>
                      {uploadStatus === 'uploading' ? 'Uploading to secure vault...' : 'Analyzing with medical AI...'}
                    </p>
                  </div>
                )}

                {uploadStatus === 'parsed' && (
                  <button
                    onClick={() => { setUploadStatus('idle'); setSelectedFile(null) }}
                    style={{
                      marginTop: 20,
                      width: '100%',
                      padding: '10px',
                      background: 'var(--neutral-50)',
                      border: '1px solid var(--neutral-200)',
                      borderRadius: 8,
                      fontSize: 13,
                      color: 'var(--neutral-600)',
                      cursor: 'pointer',
                    }}
                  >
                    Upload Another Document
                  </button>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Document Library"
            icon={<FileText size={15} color="var(--primary-600)" />}
            subtitle={`${mockDocuments.length} documents`}
          />
          <CardBody style={{ padding: '8px 0 0' }}>
            {mockDocuments.map((doc, i) => (
              <div
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  borderBottom: i < mockDocuments.length - 1 ? '1px solid var(--neutral-50)' : 'none',
                  cursor: 'pointer',
                  background: activeDoc?.id === doc.id ? 'var(--primary-50)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--success-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CheckCircle size={16} color="var(--success-600)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-800)' }}>{doc.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 2 }}>
                    {new Date(doc.upload_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <ChevronRight size={14} color="var(--neutral-300)" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div>
        {activeDoc ? (
          <Card>
            <CardHeader
              title={activeDoc.title}
              icon={<FileText size={15} color="var(--primary-600)" />}
              action={<Badge variant="success">Parsed</Badge>}
            />
            <CardBody>
              <ExtractedDataPanel doc={activeDoc} />
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody style={{ padding: 48, textAlign: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                background: 'var(--neutral-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <FileText size={28} color="var(--neutral-300)" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--neutral-600)' }}>No Document Selected</p>
              <p style={{ fontSize: 13, color: 'var(--neutral-400)', marginTop: 6 }}>
                Upload a document or select one from your library to view extracted data
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
