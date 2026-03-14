import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Scan } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import Modal from '@components/ui/Modal'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import styles from './Ultrasound.module.css'

const SCAN_TYPES = {
  obstetric: ['Dating Scan','NT Scan','TIFFA / Anomaly Scan','Growth Scan','Doppler'],
  gynae:     ['Follicular Study','PCOS Mapping','Fibroid Mapping','Endometriosis','TVS'],
}

const MOCK_SCANS = [
  { id:'US001', patient:'Priya Sharma',  patientId:'P001', date:'10 Mar 2026', type:'Dating Scan',         category:'Obstetric',  tech:'Dr. Sharma', findings:'Single live intrauterine pregnancy. FHR 156 bpm. CRL 2.4 cm.',  status:'reported' },
  { id:'US002', patient:'Anita Gupta',   patientId:'P002', date:'09 Mar 2026', type:'Follicular Study',    category:'Gynaecology',tech:'Dr. Sharma', findings:'Right ovary: dominant follicle 18mm. Endometrium 9mm.',          status:'reported' },
  { id:'US003', patient:'Deepa Nair',    patientId:'P003', date:'08 Mar 2026', type:'Growth Scan',         category:'Obstetric',  tech:'Dr. Sharma', findings:'BPD 65mm, FL 48mm. EFW 890g. AFI 14. Normal Doppler.',          status:'reported' },
  { id:'US004', patient:'Kavya Menon',   patientId:'P004', date:'07 Mar 2026', type:'PCOS Mapping',        category:'Gynaecology',tech:'Dr. Sharma', findings:'Bilateral enlarged ovaries with peripheral follicles >12 each.',  status:'reported' },
  { id:'US005', patient:'Sunita Rao',    patientId:'P003', date:'06 Mar 2026', type:'TVS',                 category:'Gynaecology',tech:'Dr. Sharma', findings:'Pending report',                                                  status:'pending'  },
]

const FINDING_TEMPLATES = {
  'Dating Scan':      'Single live intrauterine pregnancy.\nGA: ___ weeks ___ days.\nCRL: ___ cm. FHR: ___ bpm.\nYolk sac: seen. Amnion: seen.\nNo abnormality detected.',
  'NT Scan':          'Single live fetus in cephalic presentation.\nGA: ___ weeks. NT: ___ mm (normal <3mm).\nNasal bone: present.\nFHR: ___ bpm. No gross anomaly.',
  'TIFFA / Anomaly Scan': 'Fetal biometry: BPD ___ mm, HC ___ mm, AC ___ mm, FL ___ mm.\nEFW: ___ grams.\nAmniotic fluid: AFI ___ (normal).\nPlacenta: ___. No major structural anomaly detected.',
  'Growth Scan':      'BPD: ___ mm. FL: ___ mm. AC: ___ mm.\nEFW: ___ grams (___th percentile).\nAFI: ___. Placenta: ___.\nDoppler: Umbilical artery PI ___.',
  'Follicular Study': 'Right ovary: ___. Left ovary: ___.\nDominant follicle: ___ mm in ___ ovary.\nEndometrium: ___ mm, ___ pattern.\nFree fluid: absent.',
  'PCOS Mapping':     'Uterus: normal size and echotexture.\nRight ovary: ___ cc, ___ follicles.\nLeft ovary: ___ cc, ___ follicles.\nPeripheral follicular arrangement: noted.',
}

export default function Ultrasound() {
  const navigate = useNavigate()
  const [search,   setSearch]   = useState('')
  const [open,     setOpen]     = useState(false)
  const [category, setCategory] = useState('obstetric')
  const [form,     setForm]     = useState({ patient:'', patientId:'', scanType:'', date: new Date().toISOString().split('T')[0], findings:'', indication:'' })

  const set = f => setForm(d => ({ ...d, ...f }))

  const filtered = MOCK_SCANS.filter(s =>
    s.patient.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  )

  const COLUMNS = [
    {
      key:'patient', label:'Patient',
      render:(val,row) => (
        <div className={styles.cell}>
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div><div className={styles.name}>{val}</div><div className={styles.sub}>{row.patientId}</div></div>
        </div>
      )
    },
    { key:'date',     label:'Date',     render:v=><span className={styles.sub}>{v}</span> },
    { key:'type',     label:'Scan Type',render:v=><Badge variant="primary">{v}</Badge> },
    { key:'category', label:'Category', render:v=><Badge variant={v==='Obstetric'?'teal':'default'}>{v}</Badge> },
    {
      key:'findings', label:'Findings (summary)',
      render:v=><span className={styles.findings}>{v.slice(0,60)}{v.length>60?'…':''}</span>
    },
    { key:'status', label:'Status', render:v=><Badge variant={v==='reported'?'success':'warning'} dot>{v}</Badge> },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Ultrasound & Imaging</h1>
          <p className={styles.pageSub}>Scan reports and findings</p>
        </div>
        <Button icon={Plus} onClick={() => setOpen(true)}>New Scan Report</Button>
      </div>

      <div className={styles.statsRow}>
        {[
          { label:'Total Scans',    value:'124', color:'var(--clr-primary-600)' },
          { label:'This Month',     value:'18',  color:'var(--clr-teal-600)'    },
          { label:'Obstetric',      value:'72',  color:'var(--clr-accent-600)'  },
          { label:'Gynaecological', value:'52',  color:'var(--clr-warning-500)' },
        ].map(s=>(
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{color:s.color}}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon}/>
            <input className={styles.searchInput} placeholder="Search patient or scan type..."
              value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        <Table columns={COLUMNS} data={filtered} emptyMessage="No scan reports found"/>
      </Card>

      {/* New scan modal */}
      <Modal open={open} onClose={()=>setOpen(false)} title="New Scan Report" size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>{alert('Scan saved!');setOpen(false)}}>Save Report</Button>
          </>
        }>
        <div className={styles.modalGrid}>
          <Input label="Patient ID" value={form.patientId} onChange={e=>set({patientId:e.target.value})} placeholder="P001"/>
          <Input label="Patient Name" value={form.patient} onChange={e=>set({patient:e.target.value})} placeholder="Full name"/>
          <Input label="Scan Date" type="date" value={form.date} onChange={e=>set({date:e.target.value})}/>
          <Input label="Indication" value={form.indication} onChange={e=>set({indication:e.target.value})} placeholder="Reason for scan"/>
        </div>
        <div className={styles.catToggle}>
          {['obstetric','gynae'].map(c=>(
            <button key={c} className={`${styles.catBtn} ${category===c?styles.catActive:''}`}
              onClick={()=>{ setCategory(c); set({scanType:''}) }}>
              {c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>
        <div className={styles.scanTypeGrid}>
          {SCAN_TYPES[category].map(t=>(
            <button key={t}
              className={`${styles.scanTypeBtn} ${form.scanType===t?styles.scanTypeActive:''}`}
              onClick={()=>set({scanType:t, findings: FINDING_TEMPLATES[t]||''})}>
              <Scan size={14}/>{t}
            </button>
          ))}
        </div>
        <div style={{marginTop:'var(--space-4)'}}>
          <label className={styles.findingsLabel}>Findings</label>
          <textarea className={styles.findingsArea} rows={8} value={form.findings}
            onChange={e=>set({findings:e.target.value})}
            placeholder="Select a scan type above to load template, then fill in values..."/>
        </div>
      </Modal>
    </div>
  )
}