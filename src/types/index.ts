export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  blood_group: string
  date_of_birth: string
  phone?: string
  email?: string
  allergies: string[]
  chronic_conditions: string[]
  avatar_url?: string
  created_at: string
}

export interface Document {
  id: string
  patient_id: string
  title: string
  type: 'pdf' | 'image' | 'text'
  file_url?: string
  upload_date: string
  status: 'uploading' | 'extracting' | 'parsed' | 'error'
  extracted_data?: ExtractedData
  created_at: string
}

export interface ExtractedData {
  diagnosis?: string[]
  medications?: string[]
  tests?: string[]
  advice?: string[]
  followups?: string[]
  doctor?: string
  date?: string
  confidence?: number
}

export interface Condition {
  id: string
  patient_id: string
  name: string
  icd_code?: string
  status: 'active' | 'resolved' | 'chronic'
  diagnosed_date: string
  notes?: string
  document_id?: string
}

export interface Medication {
  id: string
  patient_id: string
  name: string
  dosage: string
  frequency: string
  start_date: string
  end_date?: string
  status: 'active' | 'stopped' | 'completed'
  prescribed_by?: string
  notes?: string
}

export interface TestResult {
  id: string
  patient_id: string
  test_name: string
  test_date: string
  value?: string
  unit?: string
  reference_range?: string
  status: 'normal' | 'abnormal' | 'critical'
  document_id?: string
}

export interface TimelineEvent {
  id: string
  patient_id: string
  date: string
  type: 'condition' | 'medication' | 'procedure' | 'test' | 'document' | 'alert'
  title: string
  description?: string
  source_id?: string
  source_type?: string
  metadata?: Record<string, unknown>
}

export interface BodyRegion {
  id: string
  name: string
  symptoms: BodySymptom[]
}

export interface BodySymptom {
  id: string
  patient_id: string
  region: string
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  onset_date: string
  notes?: string
}

export interface Prediction {
  id: string
  patient_id: string
  type: 'risk' | 'conflict' | 'reminder'
  title: string
  description: string
  risk_score?: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  actions: string[]
  created_at: string
}

export interface ShareLink {
  id: string
  patient_id: string
  shared_with: string
  share_type: 'doctor' | 'hospital' | 'caregiver'
  permissions: SharePermissions
  token: string
  expires_at?: string
  created_at: string
}

export interface SharePermissions {
  conditions: boolean
  medications: boolean
  documents: boolean
  timeline: boolean
  tests: boolean
}
