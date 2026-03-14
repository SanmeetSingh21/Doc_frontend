import axios from 'axios'

// ── Toggle this when backend is ready ──
const USE_MOCK = true
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Patient APIs ──
export const patientApi = {
  getAll:    () => USE_MOCK ? Promise.resolve([]) : http.get('/patients'),
  getById:   id => USE_MOCK ? Promise.resolve(null) : http.get(`/patients/${id}`),
  create:    data => USE_MOCK ? Promise.resolve({ id: 'P_NEW', ...data }) : http.post('/patients', data),
  update:    (id, data) => USE_MOCK ? Promise.resolve(data) : http.put(`/patients/${id}`, data),
}

// ── OPD APIs ──
export const opdApi = {
  getAll:    () => USE_MOCK ? Promise.resolve([]) : http.get('/consultations'),
  getById:   id => USE_MOCK ? Promise.resolve(null) : http.get(`/consultations/${id}`),
  create:    data => USE_MOCK ? Promise.resolve({ id: 'C_NEW', ...data }) : http.post('/consultations', data),
}

// ── Pregnancy APIs ──
export const pregnancyApi = {
  getAll:    () => USE_MOCK ? Promise.resolve([]) : http.get('/pregnancies'),
  getById:   id => USE_MOCK ? Promise.resolve(null) : http.get(`/pregnancies/${id}`),
  create:    data => USE_MOCK ? Promise.resolve(data) : http.post('/pregnancies', data),
  addVisit:  (id, visit) => USE_MOCK ? Promise.resolve(visit) : http.post(`/pregnancies/${id}/visits`, visit),
}

// ── Billing APIs ──
export const billingApi = {
  getAll:    () => USE_MOCK ? Promise.resolve([]) : http.get('/invoices'),
  getById:   id => USE_MOCK ? Promise.resolve(null) : http.get(`/invoices/${id}`),
  create:    data => USE_MOCK ? Promise.resolve(data) : http.post('/invoices', data),
  recordPayment: (id, payment) => USE_MOCK ? Promise.resolve(payment) : http.post(`/invoices/${id}/payments`, payment),
}

// ── Ultrasound APIs ──
export const ultrasoundApi = {
  getAll:  () => USE_MOCK ? Promise.resolve([]) : http.get('/scans'),
  create:  data => USE_MOCK ? Promise.resolve(data) : http.post('/scans', data),
}

// ── Fertility APIs ──
export const fertilityApi = {
  getAll:  () => USE_MOCK ? Promise.resolve([]) : http.get('/cycles'),
  create:  data => USE_MOCK ? Promise.resolve(data) : http.post('/cycles', data),
  update:  (id, data) => USE_MOCK ? Promise.resolve(data) : http.put(`/cycles/${id}`, data),
}

// ── Consent APIs ──
export const consentApi = {
  getAll:  () => USE_MOCK ? Promise.resolve([]) : http.get('/consents'),
  create:  data => USE_MOCK ? Promise.resolve(data) : http.post('/consents', data),
  sign:    id => USE_MOCK ? Promise.resolve({ signed: true }) : http.post(`/consents/${id}/sign`),
}

export default http