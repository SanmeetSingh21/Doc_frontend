import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import Modal from '@components/ui/Modal'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import styles from './Reconstructive.module.css'

const PROCEDURES = ['Vaginal Rejuvenation','Labiaplasty','Hymenoplasty','PRP Therapy','Laser Vaginal Tightening','Stress Urinary Incontinence Treatment']
const SESSION_STATUS = ['Scheduled','Completed','Cancelled']

const MOCK = [
  { id:'RC001', patient:'Reena Singh',  patientId:'P005', procedure:'Laser Vaginal Tightening', sessions:3, done:1, nextSession:'15 Mar 2026', consent:true,  status:'active'    },
  { id:'RC002', patient:'Kavya Menon',  patientId:'P004', procedure:'PRP Therapy',               sessions:3, done:3, nextSession:'—',           consent:true,  status:'completed' },
  { id:'RC003', patient:'Pooja Verma',  patientId:'P008', procedure:'Labiaplasty',               sessions:1, done:0, nextSession:'20 Mar 2026', consent:false, status:'scheduled' },
]

export default function Reconstructive() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ patient:'', procedure:'', sessions:'3', date:'', consentSigned: false })
  const set = f => setForm(d=>({...d,...f}))

  const COLUMNS = [
    {
      key:'patient', label:'Patient',
      render:(val,row)=>(
        <div className={styles.cell}>
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div><div className={styles.name}>{val}</div><div className={styles.sub}>{row.patientId}</div></div>
        </div>
      )
    },
    { key:'procedure',  label:'Procedure', render:v=><Badge variant="primary">{v}</Badge> },
    {
      key:'done', label:'Sessions',
      render:(val,row)=>(
        <div className={styles.sessionBar}>
          <div className={styles.sessionTrack}>
            {Array.from({length:row.sessions}).map((_,i)=>(
              <div key={i} className={`${styles.sessionDot} ${i<val?styles.sessionDone:''}`}/>
            ))}
          </div>
          <span className={styles.sub}>{val}/{row.sessions}</span>
        </div>
      )
    },
    { key:'nextSession', label:'Next Session', render:v=><span className={styles.sub}>{v}</span> },
    { key:'consent',     label:'Consent',      render:v=><Badge variant={v?'success':'danger'}>{v?'Signed':'Pending'}</Badge> },
    { key:'status',      label:'Status',       render:v=><Badge variant={v==='completed'?'success':v==='scheduled'?'default':'warning'} dot>{v.charAt(0).toUpperCase()+v.slice(1)}</Badge> },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reconstructive Gynaecology</h1>
          <p className={styles.pageSub}>Cosmetic & reconstructive procedures</p>
        </div>
        <Button icon={Plus} onClick={()=>setOpen(true)}>New Procedure</Button>
      </div>

      <div className={styles.statsRow}>
        {[
          { label:'Active Cases',      value:'6',    color:'var(--clr-primary-600)' },
          { label:'Sessions This Month',value:'14',  color:'var(--clr-teal-600)'    },
          { label:'Completed',         value:'28',   color:'var(--clr-accent-600)'  },
          { label:'Consent Pending',   value:'2',    color:'var(--clr-danger-500)'  },
        ].map(s=>(
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{color:s.color}}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <Table columns={COLUMNS} data={MOCK} emptyMessage="No procedures found"/>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title="New Procedure" size="md"
        footer={
          <>
            <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>{alert('Procedure created!');setOpen(false)}}>Create</Button>
          </>
        }>
        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
          <Input label="Patient Name" value={form.patient} onChange={e=>set({patient:e.target.value})} placeholder="Full name"/>
          <Select label="Procedure" value={form.procedure} onChange={e=>set({procedure:e.target.value})} options={PROCEDURES} placeholder="Select procedure"/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)'}}>
            <Input label="Total Sessions" type="number" value={form.sessions} onChange={e=>set({sessions:e.target.value})} min="1" max="10"/>
            <Input label="First Session Date" type="date" value={form.date} onChange={e=>set({date:e.target.value})}/>
          </div>
          <label style={{display:'flex',alignItems:'center',gap:'var(--space-3)',fontSize:'var(--text-sm)',cursor:'pointer'}}>
            <input type="checkbox" checked={form.consentSigned} onChange={e=>set({consentSigned:e.target.checked})}
              style={{width:16,height:16,accentColor:'var(--clr-primary-600)'}}/>
            Consent form signed by patient
          </label>
        </div>
      </Modal>
    </div>
  )
}