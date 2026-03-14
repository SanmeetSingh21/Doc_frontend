import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Heart, Lock, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '@/store/index'
import styles from './Login.module.css'

// Mock credentials — replace with real API call later
const MOCK_USERS = [
  { id: 'D001', email: 'doctor@gynaecare.com', password: 'doctor123',
    name: 'Dr. Sharma', role: 'doctor',    roleLabel: 'Gynaecologist'    },
  { id: 'R001', email: 'reception@gynaecare.com', password: 'reception123',
    name: 'Preethi R', role: 'reception', roleLabel: 'Receptionist'      },
  { id: 'B001', email: 'billing@gynaecare.com', password: 'billing123',
    name: 'Ramesh K',  role: 'billing',   roleLabel: 'Billing Staff'     },
  { id: 'A001', email: 'admin@gynaecare.com', password: 'admin123',
    name: 'Admin',     role: 'admin',     roleLabel: 'Clinic Admin'      },
]

export default function Login() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }

    setLoading(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 900))

    const found = MOCK_USERS.find(
      u => u.email === email.toLowerCase().trim() && u.password === password
    )

    if (found) {
      const { password: _, ...safeUser } = found
      login(safeUser)
      navigate('/dashboard', { replace: true })
    } else {
      setError('Invalid email or password. Please try again.')
    }
    setLoading(false)
  }

  const fillDemo = (user) => {
    setEmail(user.email)
    setPassword(user.password)
    setError('')
  }

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Heart size={28} strokeWidth={2}/></div>
            <div>
              <div className={styles.brandName}>GynaeCare</div>
              <div className={styles.brandPro}>PRO</div>
            </div>
          </div>

          <h1 className={styles.headline}>
            Women's health,<br/>
            <span className={styles.highlight}>simplified.</span>
          </h1>
          <p className={styles.subline}>
            The unified clinic management and EMR platform built exclusively for gynaecology, obstetrics, and fertility care.
          </p>

          <div className={styles.features}>
            {[
              'Specialty-focused EMR',
              'Episode-based patient care',
              'Smart clinical calculators',
              'GST-compliant billing',
              'Medico-legal compliance',
            ].map(f => (
              <div key={f} className={styles.feature}>
                <div className={styles.featureDot}/>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.leftFooter}>
          Trusted by gynaecologists across India
        </div>
      </div>

      {/* Right panel — login form */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSub}>Sign in to your clinic account</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={15}/>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.form}>
            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <div className={styles.inputWrap}>
                <Mail size={15} className={styles.inputIcon}/>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={15} className={styles.inputIcon}/>
                <input
                  className={styles.input}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPwd(s => !s)}
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading
                ? <span className={styles.spinner}/>
                : 'Sign in to GynaeCare Pro'
              }
            </button>
          </form>

          {/* Demo credentials */}
          <div className={styles.demoSection}>
            <div className={styles.demoLabel}>Quick demo login</div>
            <div className={styles.demoGrid}>
              {MOCK_USERS.map(u => (
                <button
                  key={u.id}
                  className={styles.demoBtn}
                  onClick={() => fillDemo(u)}
                >
                  <span className={styles.demoRole}>{u.roleLabel}</span>
                  <span className={styles.demoEmail}>{u.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}