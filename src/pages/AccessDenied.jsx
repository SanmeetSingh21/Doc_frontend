import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import Button from '@components/ui/Button'
import styles from './AccessDenied.module.css'

export default function AccessDenied() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <div className={styles.icon}><ShieldOff size={48} strokeWidth={1}/></div>
      <h1 className={styles.title}>Access Denied</h1>
      <p className={styles.sub}>
        You don't have permission to view this module.<br/>
        Please contact your clinic administrator.
      </p>
      <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </div>
  )
}