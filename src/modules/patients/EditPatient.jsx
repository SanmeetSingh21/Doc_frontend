import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, User, Heart, Users, FileText, AlertCircle } from 'lucide-react'
import Button from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import StepBasicInfo    from './steps/StepBasicInfo'
import StepGynaeHistory from './steps/StepGynaeHistory'
import StepPartnerInfo  from './steps/StepPartnerInfo'
import StepReview       from './steps/StepReview'
import { patientApi }   from '@services/api'
import styles from './PatientNew.module.css'

const STEPS = [
  { id: 1, label: 'Basic Info',      icon: User,     component: StepBasicInfo    },
  { id: 2, label: 'Gynae History',   icon: Heart,    component: StepGynaeHistory },
  { id: 3, label: 'Partner Profile', icon: Users,    component: StepPartnerInfo  },
  { id: 4, label: 'Review',          icon: FileText, component: StepReview       },
]

const INITIAL_DATA = {
  firstName: '', lastName: '', dob: '', gender: 'female',
  phone: '', email: '', aadhaar: '',
  address: '', city: '', state: '', pin: '',
  maritalStatus: '', occupation: '', bloodGroup: '',

  menarcheAge: '', cycleLength: '', lmp: '',
  menopauseStatus: false,
  gravida: '', parity: '', livingChildren: '', abortions: '',
  infertilityDuration: '', contraceptionHistory: [],
  surgicalHistory: [], medicalHistory: '', allergies: '',

  partnerName: '', partnerAge: '', partnerOccupation: '',
  partnerMedicalHistory: '', partnerPhone: '', partnerEmail: '',

  episodeType: 'opd', referredBy: '', notes: '',
}

export default function EditPatient() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = fields => setData(d => ({ ...d, ...fields }))
  const CurrentStep = STEPS[step - 1].component

  useEffect(() => {
    const load = async () => {
      try {
        const res = await patientApi.getById(id)
        const p = res.data?.data || res.data

        setData(prev => ({
          ...prev,
          firstName: p.name?.split(' ')[0] || '',
          lastName:  p.name?.split(' ').slice(1).join(' ') || '',
          dob: p.dob ? p.dob.split('T')[0] : '',   // FIX
          gender: p.gender || 'female',
          phone: p.phone || '',
          email: p.email || '',
          aadhaar: p.aadhaar || '',
          maritalStatus: p.maritalStatus || '',
          occupation: p.occupation || '',
          bloodGroup: p.bloodGroup || '',
          menarcheAge: p.menarcheAge || '',
          cycleLength: p.cycleLength || '',
          lmp: p.lastMenstrualPeriod || '',
          menopauseStatus: p.menopauseStatus || false,
          gravida: p.gravida || '',
          parity: p.parity || '',
          abortions: p.abortions || '',
          livingChildren: p.livingChildren || '',
          infertilityDuration: p.infertilityDuration || '',
          contraceptionHistory: p.contraceptionHistory
            ? p.contraceptionHistory.split(', ')
            : [],
        }))
      } catch {
        setError('Failed to load patient')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div>Loading...</div>

  const handleUpdate = async () => {
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),

        // FIX: AGE ADDED
        age: data.dob
          ? Math.floor((new Date() - new Date(data.dob)) / (365.25 * 24 * 60 * 60 * 1000))
          : undefined,

        phone: data.phone,
        email: data.email || undefined,
        aadhaar: data.aadhaar || undefined,
        dob: data.dob || undefined,
        bloodGroup: data.bloodGroup || undefined,
        maritalStatus: data.maritalStatus || undefined,
        gender: data.gender || undefined,
        occupation: data.occupation || undefined,

        menarcheAge: data.menarcheAge ? Number(data.menarcheAge) : undefined,
        cycleLength: data.cycleLength ? Number(data.cycleLength) : undefined,
        lastMenstrualPeriod: data.lmp || undefined,
        menopauseStatus: data.menopauseStatus,

        gravida: data.gravida ? Number(data.gravida) : undefined,
        parity: data.parity ? Number(data.parity) : undefined,
        abortions: data.abortions ? Number(data.abortions) : undefined,
        livingChildren: data.livingChildren ? Number(data.livingChildren) : undefined,

        infertilityDuration: data.infertilityDuration || undefined,
        contraceptionHistory: data.contraceptionHistory.length > 0
          ? data.contraceptionHistory.join(', ')
          : undefined,
      }

      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

      await patientApi.update(id, payload)

      navigate(`/patients/${id}`)

    } catch (err) {
      const msg = err.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">
      <button className={styles.backBtn} onClick={() => navigate(`/patients/${id}`)}>
        <ArrowLeft size={16}/> Back
      </button>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={15}/> {error}
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.stepper}>
          <div className={styles.stepperHeader}>
            <h2 className={styles.stepperTitle}>Edit Patient</h2>
            <p className={styles.stepperSub}>Update Details</p>
          </div>

          <div className={styles.steps}>
            {STEPS.map(s => {
              const Icon = s.icon
              const done = step > s.id
              const current = step === s.id

              return (
                <div
                  key={s.id}
                  className={`${styles.stepItem} ${done ? styles.done : ''} ${current ? styles.current : ''}`}
                  onClick={() => done && setStep(s.id)}
                >
                  <div className={styles.stepCircle}>
                    {done ? <Check size={14}/> : <Icon size={15}/>}
                  </div>
                  <div className={styles.stepMeta}>
                    <span className={styles.stepNum}>Step {s.id}</span>
                    <span className={styles.stepLabel}>{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.formArea}>
          <Card padding="lg">
            <CurrentStep data={data} update={update} />

            <div className={styles.formFooter}>
              <Button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(`/patients/${id}`)}>
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>

              {step < STEPS.length ? (
                <Button onClick={() => setStep(s => s + 1)}>
                  Continue
                </Button>
              ) : (
                <Button loading={saving} onClick={handleUpdate}>
                  {saving ? 'Updating...' : 'Update Patient'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}