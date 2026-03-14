import { useState } from 'react'
import { FileCheck, Plus, Shield, Clock } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Table from '@components/ui/Table'
import Modal from '@components/ui/Modal'
import Select from '@components/ui/Select'
import Input from '@components/ui/Input'
import styles from './Consent.module.css'

const CONSENT_TYPES = ['Surgery Consent','Cosmetic Procedure Consent','Ultrasound Consent','IVF / ART Consent','Anaesthesia Consent','Blood Transfusion Consent','General OPD Consent']

const MOCK_CONSENTS = [
  { id:'CN001', patient:'Reena Singh',  patientId:'P005', type:'Cosmetic Procedure Consent', procedure:'Laser Vaginal Tightening', signedDate:'05 Mar 2026', signedBy:'Patient + Guardian', status:'active'  },
  { id:'CN002', patient:'Deepa Nair',   patientId:'P003', type:'Surgery Consent',             procedure:'LSCS',                    signedDate:'08 Mar 2026', signedBy:'Patient',            status:'active'  },
  { id:'CN003', patient:'Anita Gupta',  patientId:'P002', type:'IVF / ART Consent',           procedure:'IVF Cycle #2',            signedDate:'01 Mar 2026', signedBy:'Patient + Partner',  status:'active'  },
  { id:'CN004', patient:'Pooja Verma',  patientId:'P008', type:'Cosmetic Procedure Consent',  procedure:'Labiaplasty',             signedDate:'—',            signedBy:'—',                  status:'pending' },
]

export default function Consent() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ patient:'', consentType:'', procedure:'', date:'' })
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
    { key:'type',       label:'Consent Type', render:v=><span className={styles.type}>{v}</span> },
    { key:'procedure',  label:'Procedure',    render:v=><span className={styles.sub}>{v}</span> },
    { key:'signedDate', label:'Signed On',    render:v=><span className={styles.sub}>{v}</span> },
    { key:'signedBy',   label:'Signed By',    render:v=><span className={styles.sub}>{v}</span> },
    { key:'status',     label:'Status',       render:v=><Badge variant={v==='active'?'success':'danger'} dot>{v.charAt(0).toUpperCase()+v.slice(1)}</Badge> },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Consent & Legal</h1>
          <p className={styles.pageSub}>Digital consents and medico-legal compliance</p>
        </div>
        <Button icon={Plus} onClick={()=>setOpen(true)}>New Consent</Button>
      </div>

      {/* Compliance cards */}
      <div className={styles.complianceRow}>
        {[
          { icon:FileCheck, label:'Digital Consents', value:'48',  sub:'All signed digitally',    color:'var(--clr-accent-600)',  bg:'var(--clr-accent-100)'  },
          { icon:Shield,    label:'Audit Trail',      value:'100%',sub:'All records timestamped', color:'var(--clr-teal-600)',    bg:'var(--clr-teal-100)'    },
          { icon:Clock,     label:'Pending Consents', value:'2',   sub:'Require patient signature',color:'var(--clr-danger-500)', bg:'var(--clr-danger-50)'   },
        ].map(c=>{
          const Icon = c.icon
          return (
            <Card key={c.label} padding="md" className={styles.compCard}>
              <div className={styles.compIcon} style={{background:c.bg,color:c.color}}>
                <Icon size={20}/>
              </div>
              <div className={styles.compValue} style={{color:c.color}}>{c.value}</div>
              <div className={styles.compLabel}>{c.label}</div>
              <div className={styles.compSub}>{c.sub}</div>
            </Card>
          )
        })}

        {/* Legal safeguards */}
        <Card padding="md" className={styles.safeguardsCard}>
          <h3 className={styles.sfTitle}>Legal Safeguards</h3>
          {[
            'Audit trail on all records',
            'Role-based access control',
            'Tamper-proof medical entries',
            'Encrypted patient data',
            'DPDP Act compliant',
          ].map(s=>(
            <div key={s} className={styles.sfItem}>
              <Shield size={12} className={styles.sfIcon}/>
              {s}
            </div>
          ))}
        </Card>
      </div>

      <Card padding="none">
        <Table columns={COLUMNS} data={MOCK_CONSENTS} emptyMessage="No consent records found"/>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title="New Digital Consent" size="md"
        footer={
          <>
            <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>{alert('Consent created & sent to patient!');setOpen(false)}}>
              Create & Send
            </Button>
          </>
        }>
        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
          <Input label="Patient Name" value={form.patient} onChange={e=>set({patient:e.target.value})} placeholder="Full name"/>
          <Select label="Consent Type" value={form.consentType} onChange={e=>set({consentType:e.target.value})} options={CONSENT_TYPES} placeholder="Select type"/>
          <Input label="Procedure / Purpose" value={form.procedure} onChange={e=>set({procedure:e.target.value})} placeholder="e.g. Laser Vaginal Tightening Session 1"/>
          <Input label="Date" type="date" value={form.date} onChange={e=>set({date:e.target.value})}/>
          <div style={{padding:'var(--space-3)',background:'var(--clr-primary-50)',borderRadius:'var(--radius-lg)',border:'1px solid var(--clr-primary-200)',fontSize:'var(--text-xs)',color:'var(--clr-primary-700)'}}>
            📱 Consent form will be sent to patient's registered mobile number for digital signature via OTP verification.
          </div>
        </div>
      </Modal>
    </div>
  )
}