import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Trash, FileText, Check, AlertCircle } from 'lucide-react'
import Button from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import { patientApi, ultrasoundApi } from '@services/api'
import styles from './Ultrasound.module.css'

const OBSTETRIC_TYPES = [
  { value: 'dating', label: 'Dating Scan' },
  { value: 'nt', label: 'NT Scan' },
  { value: 'tiffa', label: 'TIFFA / Anomaly' },
  { value: 'growth', label: 'Growth Scan' },
  { value: 'doppler', label: 'Doppler Study' },
]

const GYNAE_TYPES = [
  { value: 'follicular_study', label: 'Follicular Study' },
  { value: 'pcos_mapping', label: 'PCOS Mapping' },
  { value: 'fibroid_mapping', label: 'Fibroid Mapping' },
  { value: 'endometriosis', label: 'Endometriosis' },
  { value: 'other', label: 'Other' },
]

export default function UltrasoundForm() {
  const navigate = useNavigate()
  const { id } = useParams() // For editing
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  const episodeId = searchParams.get('episodeId')

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [patient, setPatient] = useState(null)

  const [form, setForm] = useState({
    scanCategory: 'obstetric',
    scanType: 'dating',
    scanDate: new Date().toISOString().split('T')[0],
    gestationalWeekAtScan: '',
    gestationalDaysAtScan: '',
    findings: {
      summary: '',
      biometrics: { hc: '', ac: '', fl: '', bpd: '' },
      fetalHeart: 'regular',
      presentation: 'cephalic',
      placenta: 'anterior'
    },
    impression: '',
    reportUrl: '',
    reportNotes: ''
  })

  useEffect(() => {
    // Load patient info
    const pid = patientId || form.patientId
    if (pid) {
      patientApi.getById(pid).then(res => {
        setPatient(res.data?.data || res.data)
      }).catch(console.error)
    }

    if (id) {
      setLoading(true)
      ultrasoundApi.getById(id).then(res => {
        const data = res.data?.data || res.data
        setForm({
          ...data,
          scanDate: data.scanDate?.split('T')[0] || new Date().toISOString().split('T')[0],
          findings: data.findings || form.findings
        })
      }).catch(err => {
        setError('Failed to load scan data.')
        console.error(err)
      }).finally(() => setLoading(false))
    }
  }, [id, patientId])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        patientId: patientId || patient?.id,
        episodeId: episodeId || form.episodeId,
        gestationalWeekAtScan: parseInt(form.gestationalWeekAtScan) || undefined,
        gestationalDaysAtScan: parseInt(form.gestationalDaysAtScan) || undefined,
      }

      if (id) {
        await ultrasoundApi.update(id, payload)
      } else {
        await ultrasoundApi.create(payload)
      }
      
      navigate(`/ultrasound/patient/${patientId || patient?.id}`)
    } catch (err) {
      const msg = err.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to save scan report.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading scan data...</p></div>

  const scanOptions = form.scanCategory === 'obstetric' ? OBSTETRIC_TYPES : GYNAE_TYPES

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={16}/> Back
      </button>

      <div className={styles.pageHeader} style={{ padding: '0 16px', marginBottom: '32px' }}>
        <div>
          <h1 className={styles.pageTitle}>{id ? 'Edit' : 'New'} Ultrasound Scan</h1>
          <p className={styles.pageSub}>Recording report for {patient?.name || 'Loading...'}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button icon={Save} loading={saving} onClick={handleSave}>Save Report</Button>
        </div>
      </div>

      {error && (
        <div style={{ margin: '0 16px 24px 16px', padding: '16px', backgroundColor: 'var(--clr-danger-50)', color: 'var(--clr-danger-600)', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '8px' }}>
          <AlertCircle size={18}/>
          {error}
        </div>
      )}

      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card padding="lg">
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={20} color="var(--clr-primary-600)"/> Scan Basics</h3>
            
            <div className={styles.catToggle}>
              <button 
                className={`${styles.catBtn} ${form.scanCategory === 'obstetric' ? styles.catActive : ''}`}
                onClick={() => setForm({ ...form, scanCategory: 'obstetric', scanType: 'dating' })}
              >
                Obstetric (OB)
              </button>
              <button 
                className={`${styles.catBtn} ${form.scanCategory === 'gynaecological' ? styles.catActive : ''}`}
                onClick={() => setForm({ ...form, scanCategory: 'gynaecological', scanType: 'follicular_study' })}
              >
                Gynaecological (GYN)
              </button>
            </div>

            <div className={styles.scanTypeGrid} style={{ marginBottom: '24px' }}>
              {scanOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`${styles.scanTypeBtn} ${form.scanType === opt.value ? styles.scanTypeActive : ''}`}
                  onClick={() => setForm({ ...form, scanType: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className={styles.modalGrid}>
              <Input 
                type="date" 
                label="Scan Date" 
                value={form.scanDate} 
                onChange={e => setForm({ ...form, scanDate: e.target.value })}
              />
              {form.scanCategory === 'obstetric' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input 
                    type="number" 
                    label="Week" 
                    value={form.gestationalWeekAtScan} 
                    onChange={e => setForm({ ...form, gestationalWeekAtScan: e.target.value })}
                  />
                  <Input 
                    type="number" 
                    label="Days" 
                    value={form.gestationalDaysAtScan} 
                    onChange={e => setForm({ ...form, gestationalDaysAtScan: e.target.value })}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card padding="lg">
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Scan Findings</h3>
            <label className={styles.findingsLabel}>Detailed Findings (Structured)</label>
            <textarea 
              className={styles.findingsArea}
              rows={8}
              placeholder="Detailed findings and observations..."
              value={form.findings.summary || ''}
              onChange={e => setForm({ ...form, findings: { ...form.findings, summary: e.target.value } })}
            />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card padding="lg">
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Conclusion</h3>
            <Input 
              label="Final Impression" 
              placeholder="e.g. Single live IUP of 12 weeks..." 
              value={form.impression}
              onChange={e => setForm({ ...form, impression: e.target.value })}
            />
            <div style={{ marginTop: '24px' }}>
              <label className={styles.findingsLabel}>Clinical Notes</label>
              <textarea 
                className={styles.findingsArea}
                rows={4}
                placeholder="Additional notes or doctor instructions..."
                value={form.reportNotes}
                onChange={e => setForm({ ...form, reportNotes: e.target.value })}
              />
            </div>
          </Card>

          <Card padding="lg">
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Attachment</h3>
            {form.reportUrl ? (
              <div style={{ padding: '16px', background: 'var(--clr-gray-50)', borderRadius: '8px', border: '1px dashed var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} color="var(--clr-primary-600)"/>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>report.pdf</span>
                </div>
                <button onClick={() => setForm({...form, reportUrl: ''})} style={{ border: 'none', background: 'none', color: 'var(--clr-danger-600)', cursor: 'pointer' }}>
                  <Trash size={16}/>
                </button>
              </div>
            ) : (
              <div style={{ padding: '32px 16px', background: 'var(--clr-gray-50)', borderRadius: '8px', border: '2px dashed var(--border-default)', textAlign: 'center' }}>
                <Upload size={24} color="var(--text-muted)" style={{ marginBottom: '12px' }}/>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>Upload scan report (PDF, PNG, JPG)</div>
                <Button variant="outline" size="sm" onClick={() => setForm({...form, reportUrl: 'https://example.com/report.pdf'})}>Upload File</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
