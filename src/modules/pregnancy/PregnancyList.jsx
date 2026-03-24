import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Baby, AlertTriangle, Calendar } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import { episodeApi } from '@services/api'
import styles from './PregnancyList.module.css'

const STATUS_VARIANT = { active: 'success', 'high-risk': 'danger', delivered: 'teal' }

export default function PregnancyList() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await episodeApi.getAll('pregnancy')
        const d = res.data?.data || res.data
        setData(Array.isArray(d) ? d : res.data.episodes || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="page-container">Loading...</div>

  const filtered = data.filter(p =>
    (p.patient?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.patient?.id || '').toString().includes(search) ||
    (p.id || '').toString().includes(search)
  )

  const patientMap = {}
  filtered.forEach(e => {
    const rawPatientId = e.patient?.id
    if (!rawPatientId) return
    const primaryPreg = e.pregnancies?.[0]
    
    if (!patientMap[rawPatientId]) {
      patientMap[rawPatientId] = {
        id: e.id,
        rawPatientId,
        patient: e.patient,
        lmp: primaryPreg?.lmp || e.lmp, 
        visits: primaryPreg?.ancVisits || [],
        risks: primaryPreg?.risks || [],
        status: e.episodeStatus || 'active'
      }
    }
  })
  const tableData = Object.values(patientMap)

  const activeCount = tableData.filter(d => d.status === 'active').length
  const highRiskCount = tableData.filter(d => d.risks && d.risks.length > 0).length
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const dueThisMonthCount = tableData.filter(d => {
    if (d.status !== 'active' || !d.lmp) return false
    const lmpDate = new Date(d.lmp)
    const edd = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000)
    return edd.getMonth() === currentMonth && edd.getFullYear() === currentYear
  }).length

  const deliveredCount = tableData.filter(d => d.status?.toLowerCase() === 'delivered').length

  const COLUMNS = [
    {
      key: 'name',
      label: 'Patient',
      render: (_, row) => {
        const name = row.patient?.name || '—'
        const age = row.patient?.age || '—'

        return (
          <div className={styles.patientCell}>
            <div className={styles.avatar}>
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className={styles.name}>{name}</div>
              <div className={styles.sub}>{row.patient?.id?.slice(0,8) || '—'} · {age} yrs</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'lmp',
      label: 'LMP / EDD',
      render: (_, row) => {
        const lmpDate = row.lmp ? new Date(row.lmp) : null

        const lmp = lmpDate
          ? lmpDate.toLocaleDateString('en-IN')
          : '—'

        const edd = lmpDate
          ? new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000)
              .toLocaleDateString('en-IN')
          : '—'

        return (
          <div>
            <div className={styles.dateVal}>
              <Calendar size={12}/> LMP: {lmp}
            </div>
            <div className={styles.sub}>
              <Baby size={12}/> EDD: {edd}
            </div>
          </div>
        )
      }
    },
    {
      key: 'weeks',
      label: 'Gestation',
      render: (_, row) => {
        if (!row.lmp) return <span className={styles.weeks}>—</span>

        const lmpDate = new Date(row.lmp)
        const today = new Date()

        const diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24))
        const weeks = Math.floor(diffDays / 7)
        const days = diffDays % 7

        return <span className={styles.weeks}>{weeks}W {days}D</span>
      }
    },
    {
      key: 'visits',
      label: 'ANC Visits',
      render: (_, row) => (
        <span className={styles.visits}>
          {row.visits?.length || 0} visits
        </span>
      )
    },
    {
      key: 'risks',
      label: 'Risk Flags',
      render: (_, row) => {
        const risks = row.risks || []

        return risks.length === 0
          ? <span className={styles.noRisk}>None</span>
          : (
            <div className={styles.riskList}>
              {risks.map(r => (
                <Badge key={r} variant="danger" size="sm">
                  <AlertTriangle size={10}/> {r}
                </Badge>
              ))}
            </div>
          )
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => {
        const v = row.status || 'active'

        return (
          <Badge variant={STATUS_VARIANT[v] || 'default'} dot>
            {v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}
          </Badge>
        )
      }
    },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Pregnancy & ANC</h1>
          <p className={styles.pageSub}>Antenatal care tracking</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        <Card padding="sm" className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--clr-primary-600)' }}>{loading ? '...' : activeCount}</div>
          <div className={styles.statLabel}>Active Pregnancies</div>
        </Card>

        <Card padding="sm" className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--clr-danger-600)' }}>{loading ? '...' : highRiskCount}</div>
          <div className={styles.statLabel}>High Risk</div>
        </Card>

        <Card padding="sm" className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--clr-accent-600)' }}>{loading ? '...' : dueThisMonthCount}</div>
          <div className={styles.statLabel}>Due This Month</div>
        </Card>

        <Card padding="sm" className={styles.statCard}>
          <div className={styles.statValue} style={{ color: 'var(--clr-teal-600)' }}>{loading ? '...' : deliveredCount}</div>
          <div className={styles.statLabel}>Delivered</div>
        </Card>
      </div>

      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon}/>
            <input
              className={styles.searchInput}
              placeholder="Search patient or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={COLUMNS}
          data={tableData}
          onRowClick={row => navigate(`/pregnancy/patient/${row.rawPatientId}`)}
        />
      </Card>
    </div>
  )
}