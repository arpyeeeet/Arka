import type { Patient, Condition, Medication, TestResult, TimelineEvent, Prediction, Document } from '../types'

export const mockPatient: Patient = {
  id: '1',
  name: 'Sarah Johnson',
  age: 42,
  gender: 'Female',
  blood_group: 'A+',
  date_of_birth: '1982-03-15',
  phone: '+1 (555) 234-5678',
  email: 'sarah.johnson@email.com',
  allergies: ['Penicillin', 'Sulfa drugs', 'Latex'],
  chronic_conditions: ['Type 2 Diabetes', 'Hypertension', 'Mild Asthma'],
  created_at: '2020-01-10',
}

export const mockConditions: Condition[] = [
  { id: 'c1', patient_id: '1', name: 'Type 2 Diabetes Mellitus', icd_code: 'E11', status: 'chronic', diagnosed_date: '2019-06-12', notes: 'Well controlled with Metformin. HbA1c at 6.8%.' },
  { id: 'c2', patient_id: '1', name: 'Essential Hypertension', icd_code: 'I10', status: 'chronic', diagnosed_date: '2020-02-14', notes: 'BP consistently around 128/82 on medication.' },
  { id: 'c3', patient_id: '1', name: 'Mild Persistent Asthma', icd_code: 'J45.30', status: 'active', diagnosed_date: '2015-09-20', notes: 'Seasonal exacerbations. Well managed with inhaler.' },
  { id: 'c4', patient_id: '1', name: 'Vitamin D Deficiency', icd_code: 'E55.9', status: 'resolved', diagnosed_date: '2022-03-01', notes: 'Resolved after 3 months of supplementation.' },
  { id: 'c5', patient_id: '1', name: 'GERD', icd_code: 'K21.0', status: 'active', diagnosed_date: '2021-07-18', notes: 'Managed with dietary changes and PPI.' },
]

export const mockMedications: Medication[] = [
  { id: 'm1', patient_id: '1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', start_date: '2019-06-20', status: 'active', prescribed_by: 'Dr. Emily Chen' },
  { id: 'm2', patient_id: '1', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', start_date: '2020-02-20', status: 'active', prescribed_by: 'Dr. Michael Roberts' },
  { id: 'm3', patient_id: '1', name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'As needed', start_date: '2015-09-25', status: 'active', prescribed_by: 'Dr. Anna Park' },
  { id: 'm4', patient_id: '1', name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily before breakfast', start_date: '2021-07-25', status: 'active', prescribed_by: 'Dr. Emily Chen' },
  { id: 'm5', patient_id: '1', name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Once daily', start_date: '2022-03-05', end_date: '2022-06-05', status: 'completed', prescribed_by: 'Dr. Emily Chen' },
  { id: 'm6', patient_id: '1', name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', start_date: '2020-04-10', status: 'active', prescribed_by: 'Dr. Michael Roberts' },
]

export const mockTests: TestResult[] = [
  { id: 't1', patient_id: '1', test_name: 'HbA1c', test_date: '2024-11-15', value: '6.8', unit: '%', reference_range: '< 5.7 (Normal), < 7.0 (Target for Diabetes)', status: 'normal' },
  { id: 't2', patient_id: '1', test_name: 'Fasting Blood Glucose', test_date: '2024-11-15', value: '112', unit: 'mg/dL', reference_range: '70-100 mg/dL', status: 'abnormal' },
  { id: 't3', patient_id: '1', test_name: 'Blood Pressure', test_date: '2024-12-01', value: '128/82', unit: 'mmHg', reference_range: '< 120/80 mmHg', status: 'abnormal' },
  { id: 't4', patient_id: '1', test_name: 'Total Cholesterol', test_date: '2024-11-15', value: '195', unit: 'mg/dL', reference_range: '< 200 mg/dL', status: 'normal' },
  { id: 't5', patient_id: '1', test_name: 'eGFR', test_date: '2024-11-15', value: '78', unit: 'mL/min/1.73m²', reference_range: '> 60 mL/min/1.73m²', status: 'normal' },
  { id: 't6', patient_id: '1', test_name: 'Serum Creatinine', test_date: '2024-11-15', value: '0.95', unit: 'mg/dL', reference_range: '0.6-1.2 mg/dL', status: 'normal' },
  { id: 't7', patient_id: '1', test_name: 'LDL Cholesterol', test_date: '2024-11-15', value: '118', unit: 'mg/dL', reference_range: '< 100 mg/dL (for Diabetics)', status: 'abnormal' },
  { id: 't8', patient_id: '1', test_name: 'TSH', test_date: '2024-09-10', value: '2.4', unit: 'mIU/L', reference_range: '0.4-4.0 mIU/L', status: 'normal' },
]

export const mockTimeline: TimelineEvent[] = [
  { id: 'e1', patient_id: '1', date: '2015-09-20', type: 'condition', title: 'Diagnosed: Mild Asthma', description: 'First diagnosis following recurring bronchospasms. Prescribed Salbutamol inhaler.' },
  { id: 'e2', patient_id: '1', date: '2019-06-12', type: 'condition', title: 'Diagnosed: Type 2 Diabetes', description: 'HbA1c of 8.2% at diagnosis. Started Metformin therapy.' },
  { id: 'e3', patient_id: '1', date: '2019-06-20', type: 'medication', title: 'Started Metformin 500mg', description: 'Twice daily to manage blood glucose levels.' },
  { id: 'e4', patient_id: '1', date: '2020-02-14', type: 'condition', title: 'Diagnosed: Hypertension', description: 'Blood pressure consistently elevated at 145/92. Started Amlodipine.' },
  { id: 'e5', patient_id: '1', date: '2020-04-10', type: 'medication', title: 'Added Aspirin 81mg', description: 'For cardiovascular risk reduction given diabetes + hypertension.' },
  { id: 'e6', patient_id: '1', date: '2021-07-18', type: 'condition', title: 'Diagnosed: GERD', description: 'Chronic acid reflux confirmed via endoscopy. Started Omeprazole.' },
  { id: 'e7', patient_id: '1', date: '2022-03-01', type: 'test', title: 'Low Vitamin D Detected', description: 'Serum 25(OH)D at 14 ng/mL. Supplementation initiated.' },
  { id: 'e8', patient_id: '1', date: '2023-05-22', type: 'procedure', title: 'Annual Diabetic Eye Exam', description: 'No retinopathy detected. Follow up in 12 months.' },
  { id: 'e9', patient_id: '1', date: '2024-03-10', type: 'test', title: 'Comprehensive Metabolic Panel', description: 'All values within acceptable range. HbA1c 7.1% — slightly elevated.' },
  { id: 'e10', patient_id: '1', date: '2024-11-15', type: 'test', title: 'Annual Blood Work', description: 'HbA1c improved to 6.8%. LDL still slightly high at 118 mg/dL.' },
  { id: 'e11', patient_id: '1', date: '2024-12-01', type: 'document', title: 'Uploaded: Cardiology Consultation Report', description: 'Referred for cardiac assessment due to hypertension history.' },
]

export const mockPredictions: Prediction[] = [
  {
    id: 'p1',
    patient_id: '1',
    type: 'risk',
    title: 'Elevated Cardiovascular Risk',
    description: 'Combination of Diabetes + Hypertension + Elevated LDL significantly increases 10-year CVD risk to ~18%.',
    risk_score: 18,
    urgency: 'high',
    actions: ['Schedule cardiologist follow-up', 'Consider statin therapy', 'Target LDL < 100 mg/dL', 'Increase physical activity'],
    created_at: '2024-12-01',
  },
  {
    id: 'p2',
    patient_id: '1',
    type: 'conflict',
    title: 'Potential Drug Interaction',
    description: 'Metformin + Amlodipine combination may enhance hypoglycemic effects. Monitor blood glucose more frequently.',
    urgency: 'medium',
    actions: ['Monitor glucose 3x/day', 'Report dizziness or confusion', 'Discuss with prescribing physician'],
    created_at: '2024-12-01',
  },
  {
    id: 'p3',
    patient_id: '1',
    type: 'reminder',
    title: 'Overdue: Diabetic Foot Exam',
    description: 'Last diabetic foot examination was over 14 months ago. Annual exams are critical for early neuropathy detection.',
    urgency: 'medium',
    actions: ['Schedule podiatrist appointment', 'Daily self-inspection of feet', 'Ensure proper diabetic footwear'],
    created_at: '2024-12-01',
  },
  {
    id: 'p4',
    patient_id: '1',
    type: 'reminder',
    title: 'Upcoming: Annual Eye Exam Due',
    description: 'Annual diabetic retinopathy screening is due in 2 months based on your last exam date.',
    urgency: 'low',
    actions: ['Book ophthalmology appointment', 'Bring blood glucose log'],
    created_at: '2024-12-01',
  },
  {
    id: 'p5',
    patient_id: '1',
    type: 'risk',
    title: 'Kidney Function Monitoring',
    description: 'Diabetes and hypertension are leading causes of CKD. eGFR at 78 — consider more frequent monitoring.',
    risk_score: 22,
    urgency: 'medium',
    actions: ['6-monthly eGFR testing', 'Urine microalbumin test', 'Maintain BP < 130/80', 'Stay well hydrated'],
    created_at: '2024-12-01',
  },
]

export const mockDocuments: Document[] = [
  {
    id: 'd1',
    patient_id: '1',
    title: 'Annual Blood Work Report — Nov 2024',
    type: 'pdf',
    upload_date: '2024-11-20',
    status: 'parsed',
    extracted_data: {
      diagnosis: ['Type 2 Diabetes — controlled', 'Hyperlipidemia'],
      medications: ['Continue Metformin 500mg BD', 'Consider statin therapy'],
      tests: ['HbA1c: 6.8%', 'FBG: 112 mg/dL', 'LDL: 118 mg/dL', 'eGFR: 78'],
      advice: ['Low carbohydrate diet', 'Regular moderate exercise', 'Reduce saturated fats'],
      followups: ['3-month HbA1c check', 'Lipid panel in 6 months'],
      doctor: 'Dr. Emily Chen',
      date: '2024-11-15',
      confidence: 94,
    },
    created_at: '2024-11-20',
  },
  {
    id: 'd2',
    patient_id: '1',
    title: 'Cardiology Consultation Report',
    type: 'pdf',
    upload_date: '2024-12-01',
    status: 'parsed',
    extracted_data: {
      diagnosis: ['Hypertensive Heart Disease — early stage', 'No structural abnormality'],
      medications: ['Continue Amlodipine 5mg', 'Add Ramipril 2.5mg if BP not controlled'],
      tests: ['ECG: Normal sinus rhythm', 'Echo: EF 62%, mild LVH'],
      advice: ['Reduce sodium intake < 2g/day', 'DASH diet recommended', 'Moderate aerobic exercise 150min/week'],
      followups: ['BP monitoring every 2 weeks', 'Repeat Echo in 12 months'],
      doctor: 'Dr. Michael Roberts',
      date: '2024-11-28',
      confidence: 91,
    },
    created_at: '2024-12-01',
  },
]

export const bloodSugarTrend = [
  { month: 'Jan', hba1c: 7.8, fasting: 135 },
  { month: 'Mar', hba1c: 7.5, fasting: 128 },
  { month: 'May', hba1c: 7.3, fasting: 122 },
  { month: 'Jul', hba1c: 7.1, fasting: 118 },
  { month: 'Sep', hba1c: 7.0, fasting: 115 },
  { month: 'Nov', hba1c: 6.8, fasting: 112 },
]

export const bloodPressureTrend = [
  { month: 'Jan', systolic: 142, diastolic: 90 },
  { month: 'Mar', systolic: 138, diastolic: 88 },
  { month: 'May', systolic: 135, diastolic: 86 },
  { month: 'Jul', systolic: 132, diastolic: 84 },
  { month: 'Sep', systolic: 130, diastolic: 83 },
  { month: 'Nov', systolic: 128, diastolic: 82 },
]
