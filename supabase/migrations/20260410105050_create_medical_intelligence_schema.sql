/*
  # Medical Intelligence Platform — Full Schema

  ## Overview
  Complete database schema for the Unified Personal Health Record System.

  ## New Tables

  ### patients
  - Core patient demographic data including name, age, blood group, allergies, chronic conditions

  ### documents
  - Uploaded medical documents (PDFs, images, text)
  - Stores upload status, extraction status, and extracted JSON data

  ### conditions
  - Medical conditions/diagnoses associated with a patient
  - Includes ICD codes, status (active/chronic/resolved), diagnosis date

  ### medications
  - Current and past medications with dosage, frequency, and prescribing physician

  ### test_results
  - Lab and diagnostic test results with values, units, and reference ranges

  ### timeline_events
  - Chronological events (diagnoses, medications, procedures, tests, documents)

  ### body_symptoms
  - Symptoms mapped to specific body regions with severity tracking

  ### predictions
  - AI-generated health risk scores, drug conflicts, and reminders

  ### share_links
  - Secure record sharing with permission scoping by data category

  ## Security
  - RLS enabled on all tables
  - Patients can only access their own data
  - All policies use auth.uid() for ownership verification
*/

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL DEFAULT '',
  age integer DEFAULT 0,
  gender text DEFAULT '',
  blood_group text DEFAULT '',
  date_of_birth date,
  phone text DEFAULT '',
  email text DEFAULT '',
  allergies text[] DEFAULT '{}',
  chronic_conditions text[] DEFAULT '{}',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own record"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Patients can insert own record"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Patients can update own record"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  title text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'pdf',
  file_url text DEFAULT '',
  upload_date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'uploading',
  extracted_data jsonb DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = documents.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can update own documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = documents.patient_id AND patients.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

-- Conditions
CREATE TABLE IF NOT EXISTS conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  name text NOT NULL DEFAULT '',
  icd_code text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  diagnosed_date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  document_id uuid REFERENCES documents(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own conditions"
  ON conditions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = conditions.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own conditions"
  ON conditions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can update own conditions"
  ON conditions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = conditions.patient_id AND patients.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  name text NOT NULL DEFAULT '',
  dosage text DEFAULT '',
  frequency text DEFAULT '',
  start_date date DEFAULT CURRENT_DATE,
  end_date date DEFAULT NULL,
  status text NOT NULL DEFAULT 'active',
  prescribed_by text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = medications.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = medications.patient_id AND patients.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

-- Test Results
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  test_name text NOT NULL DEFAULT '',
  test_date date DEFAULT CURRENT_DATE,
  value text DEFAULT '',
  unit text DEFAULT '',
  reference_range text DEFAULT '',
  status text NOT NULL DEFAULT 'normal',
  document_id uuid REFERENCES documents(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own test results"
  ON test_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = test_results.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own test results"
  ON test_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can update own test results"
  ON test_results FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = test_results.patient_id AND patients.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

-- Timeline Events
CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  type text NOT NULL DEFAULT 'document',
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  source_id uuid DEFAULT NULL,
  source_type text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own timeline"
  ON timeline_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = timeline_events.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own timeline events"
  ON timeline_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

-- Body Symptoms
CREATE TABLE IF NOT EXISTS body_symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  region text NOT NULL DEFAULT '',
  symptom text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'mild',
  onset_date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE body_symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own symptoms"
  ON body_symptoms FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = body_symptoms.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own symptoms"
  ON body_symptoms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can update own symptoms"
  ON body_symptoms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = body_symptoms.patient_id AND patients.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can delete own symptoms"
  ON body_symptoms FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = body_symptoms.patient_id AND patients.user_id = auth.uid())
  );

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  type text NOT NULL DEFAULT 'risk',
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  risk_score integer DEFAULT NULL,
  urgency text NOT NULL DEFAULT 'low',
  actions text[] DEFAULT '{}',
  dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = predictions.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can update own predictions"
  ON predictions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = predictions.patient_id AND patients.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

-- Share Links
CREATE TABLE IF NOT EXISTS share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  shared_with text NOT NULL DEFAULT '',
  share_type text NOT NULL DEFAULT 'doctor',
  permissions jsonb NOT NULL DEFAULT '{"conditions": true, "medications": true, "documents": false, "timeline": false, "tests": true}',
  token text NOT NULL DEFAULT '',
  expires_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own share links"
  ON share_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = share_links.patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can insert own share links"
  ON share_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = auth.uid())
  );

CREATE POLICY "Patients can delete own share links"
  ON share_links FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM patients WHERE patients.id = share_links.patient_id AND patients.user_id = auth.uid())
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_patient_id ON documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_conditions_patient_id ON conditions(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_test_results_patient_id ON test_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_patient_date ON timeline_events(patient_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_body_symptoms_patient_id ON body_symptoms(patient_id);
CREATE INDEX IF NOT EXISTS idx_predictions_patient_id ON predictions(patient_id);
CREATE INDEX IF NOT EXISTS idx_share_links_patient_id ON share_links(patient_id);
