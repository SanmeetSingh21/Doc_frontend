import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { episodeApi } from '@services/api'
import styles from './Reconstructive.module.css'

export default function ReconstructiveList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await episodeApi.getAll('procedure')
        const d = res.data?.data || res.data
        setEpisodes(Array.isArray(d) ? d : res.data.episodes || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = episodes.filter(e => {
    const pName = e.patient?.name || ''
    const q = search.toLowerCase()
    return pName.toLowerCase().includes(q) || e.patient?.id?.toLowerCase().includes(q)
  })

  // Group by patient
  const patientMap = {}
  filtered.forEach(e => {
    const rawPatientId = e.patient?.id
    if (!rawPatientId) return
    
    // Get the latest procedure in this episode
    const latestProc = e.procedures?.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    
    if (!patientMap[rawPatientId]) {
      const doneSessions = latestProc?.sessions?.length || 0
      const totalSessions = latestProc?.plannedSessions || 0
      const hasConsent = (latestProc?.consents?.length || 0) > 0

      patientMap[rawPatientId] = {
        id: e.id,
        rawPatientId,
        patientName: e.patient.name || 'Unknown',
        patientId: e.patient.id?.slice(0, 8) || '—',
        procedure: latestProc?.procedureType || '—',
        sessions: totalSessions,
        done: doneSessions,
        nextSession: '—', // This would need a "next session" logic if we have scheduled sessions
        consent: hasConsent,
        status: latestProc?.status?.toLowerCase() || e.episodeStatus || 'pending'
      }
    }
  })
  const tableData = Object.values(patientMap)

  // Stats calculation
  const activeCases = episodes.filter(e => e.episodeStatus === 'active').length
  const completedCount = episodes.filter(e => e.episodeStatus === 'inactive' || e.procedures?.some(p => p.status === 'completed')).length
  
  const now = new Date()
  const sessionsThisMonth = episodes.reduce((acc, e) => {
    return acc + (e.procedures?.reduce((pAcc, p) => {
      return pAcc + (p.sessions?.filter(s => {
        const d = new Date(s.sessionDate || s.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length || 0)
    }, 0) || 0)
  }, 0)

  const consentPendingCount = episodes.filter(e => e.procedures?.some(p => !p.consents || p.consents.length === 0)).length

  const COLUMNS = [
    {
      key: 'patientName', label: 'Patient',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div className={styles.name}>{val}</div>
            <div className={styles.sub}>{row.patientId}</div>
          </div>
        </div>
      )
    },
    { key: 'procedure', label: 'Procedure', render: v => <Badge variant="primary" size="sm">{v.replace(/_/g, ' ')}</Badge> },
    {
      key: 'done', label: 'Sessions',
      render: (val, row) => (
        <div className={styles.sessionBar}>
          <div className={styles.sessionTrack}>
            {Array.from({ length: Math.max(val, row.sessions, 1) }).map((_, i) => (
              <div key={i} className={`${styles.sessionDot} ${i < val ? styles.sessionDone : ''}`} />
            ))}
          </div>
          <span className={styles.sub}>{val}/{row.sessions}</span>
        </div>
      )
    },
    { key: 'nextSession', label: 'Next Session', render: v => <span className={styles.sub}>{v}</span> },
    { key: 'consent', label: 'Consent', render: v => <Badge variant={v ? 'success' : 'danger'}>{v ? 'Signed' : 'Pending'}</Badge> },
    { 
      key: 'status', label: 'Status', align: 'center',
      render: v => <Badge variant={v === 'completed' ? 'success' : v === 'active' || v === 'in_progress' ? 'warning' : 'default'} dot>{v}</Badge> 
    }
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reconstructive Gynaecology</h1>
          <p className={styles.pageSub}>Cosmetic & reconstructive procedures</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: 'Active Cases',       value: loading ? '...' : activeCases,        color: 'var(--clr-primary-600)', icon: Activity },
          { label: 'Sessions This Month', value: loading ? '...' : sessionsThisMonth,  color: 'var(--clr-teal-600)',    icon: Clock },
          { label: 'Completed',          value: loading ? '...' : completedCount,     color: 'var(--clr-accent-600)',  icon: CheckCircle },
          { label: 'Consent Pending',    value: loading ? '...' : consentPendingCount, color: 'var(--clr-danger-500)',  icon: AlertCircle },
        ].map(s => (
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon}/>
            <input className={styles.searchInput}
              placeholder="Search patient, procedure..."
              value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <Table 
          columns={COLUMNS} 
          data={tableData}
          onRowClick={row => navigate(`/reconstructive/patient/${row.rawPatientId}`)}
          emptyMessage={loading ? "Loading..." : "No procedure records found"}
        />
      </Card>
    </div>
  )
}
