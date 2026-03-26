// These match the backend enums exactly
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const MARITAL_STATUS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
]

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]

export const EPISODE_TYPES = [
  { value: 'opd', label: 'OPD Consultation' },
  { value: 'pregnancy', label: 'Pregnancy Care' },
  // { value: 'fertility', label: 'Fertility Cycle'        },
  { value: 'ultrasound', label: 'Ultrasound Study' },
  { value: 'procedure', label: 'Reconstructive Procedure' },
  // { value: 'lab',       label: 'Lab Diagnosis'          },
]

export const CONTRACEPTION_OPTIONS = [
  'None', 'OCP', 'Condom', 'IUD / Copper-T', 'Hormonal IUD',
  'Injectable', 'Implant', 'Tubectomy', 'Natural methods',
]

export const SURGICAL_HISTORY_OPTIONS = [
  'LSCS', 'Laparoscopy', 'Hysteroscopy', 'Myomectomy',
  'Tubal surgery', 'Hysterectomy', 'Appendectomy', 'Other',
]

export const STATES_IN = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
]

export const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other']