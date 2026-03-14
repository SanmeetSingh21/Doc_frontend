import { useState } from 'react'
import { Plus, FlaskConical } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Input from '@components/ui/Input'
import Select from '@components/ui/Select'
import Modal from '@components/ui/Modal'
import Table from '@components/ui/Table'
import styles from './Fertility.module.css'

const PROTOCOLS = ['Long Protocol','Short Protocol','Antagonist Protocol','Natural Cycle','Mini IVF']
const CYCLE_STAGES = ['Stimulation','Monitoring','Egg Retrieval','Fertilisation','Embryo Transfer','Luteal Support','Outcome']
const OUTCOMES = ['Positive β-hCG','Negative β-hCG','Chemical Pregnancy','Clinical Pregnancy','Ongoing','Cancelled']

const MOCK_CYCLES = [
  { id:'IVF001', patient:'Anita Gupta',  patientId:'P002', cycleNo:2, protocol:'Antagonist Protocol', startDate:'01 Mar 2026', stage:'Monitoring',        outcome:'—',              status:'active'    },
  { id:'IVF002', patient:'Meena Pillai', patientId:'P007', cycleNo:1, protocol:'Long Protocol',       startDate:'01 Feb 2026', stage:'Embryo Transfer',   outcome:'—',              status:'active'    },
  { id:'IVF003', patient:'Sunita Rao',   patientId:'P003', cycleNo:3, protocol:'Antagonist Protocol', startDate:'05 Jan 2026', stage:'Outcome',           outcome:'Clinical Pregnancy', status:'success' },
  { id:'IVF004', patient:'Reena Singh',  patientId:'P005', cycleNo:1, protocol:'Short Protocol',      startDate:'10 Dec 2025', stage:'Outcome',           outcome:'Negative β-hCG', status:'failed'    },
]

const STATUS_VARIANT = { active:'warning', success:'success', failed:'danger', cancelled:'default' }
const STAGE_VARIANT  = { 'Stimulation':'default','Monitoring':'warning','Egg Retrieval':'teal','Fertilisation':'primary','Embryo Transfer':'primary','Luteal Support':'teal','Outcome':'success' }

export default function Fertility() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ patient:'', patientId:'', protocol:'', startDate:'', notes:'' })
  const set = f => setForm(d=>({...d,...f}))

  const COLUMNS = [
    {
      key:'patient', label:'Patient',
      render:(val,row)=>(
        <div className={styles.cell}>
          <div className={styles.avatar}>{val.split(' ').map(n=>n[0]).join('')}</div>
          <div><div className={styles.name}>{val}</div><div className={styles.sub}>Cycle #{row.cycleNo}</div></div>
        </div>
      )
    },
    { key:'protocol',  label:'Protocol',  render:v=><span className={styles.sub}>{v}</span> },
    { key:'startDate', label:'Started',   render:v=><span className={styles.sub}>{v}</span> },
    { key:'stage',     label:'Stage',     render:v=><Badge variant={STAGE_VARIANT[v]||'default'}>{v}</Badge> },
    { key:'outcome',   label:'Outcome',   render:v=><span className={styles.outcome}>{v}</span> },
    { key:'status',    label:'Status',    render:v=><Badge variant={STATUS_VARIANT[v]} dot>{v.charAt(0).toUpperCase()+v.slice(1)}</Badge> },
  ]

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Fertility & IVF</h1>
          <p className={styles.pageSub}>Cycle tracking and outcomes</p>
        </div>
        <Button icon={Plus} onClick={()=>setOpen(true)}>New Cycle</Button>
      </div>

      <div className={styles.statsRow}>
        {[
          { label:'Active Cycles',      value:'8',   color:'var(--clr-primary-600)' },
          { label:'Success Rate',       value:'62%', color:'var(--clr-accent-600)'  },
          { label:'Cycles This Year',   value:'24',  color:'var(--clr-teal-600)'    },
          { label:'Embryos Frozen',     value:'31',  color:'var(--clr-warning-500)' },
        ].map(s=>(
          <Card key={s.label} padding="sm" className={styles.statCard}>
            <div className={styles.statValue} style={{color:s.color}}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Stage pipeline */}
      <Card padding="md" className={styles.pipelineCard}>
        <h3 className={styles.sectionTitle}>Cycle Stage Pipeline</h3>
        <div className={styles.pipeline}>
          {CYCLE_STAGES.map((stage, i) => {
            const count = MOCK_CYCLES.filter(c => c.stage === stage && c.status === 'active').length
            return (
              <div key={stage} className={styles.pipelineStage}>
                <div className={styles.pipelineNum}>{i+1}</div>
                <div className={styles.pipelineName}>{stage}</div>
                {count > 0 && <Badge variant="warning">{count}</Badge>}
              </div>
            )
          })}
        </div>
      </Card>

      <Card padding="none">
        <Table columns={COLUMNS} data={MOCK_CYCLES} emptyMessage="No cycles found"/>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title="New Fertility Cycle" size="md"
        footer={
          <>
            <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>{alert('Cycle created!');setOpen(false)}}>Create Cycle</Button>
          </>
        }>
        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)'}}>
            <Input label="Patient ID" value={form.patientId} onChange={e=>set({patientId:e.target.value})} placeholder="P001"/>
            <Input label="Patient Name" value={form.patient} onChange={e=>set({patient:e.target.value})} placeholder="Full name"/>
          </div>
          <Select label="Protocol" value={form.protocol} onChange={e=>set({protocol:e.target.value})} options={PROTOCOLS} placeholder="Select protocol"/>
          <Input label="Cycle Start Date" type="date" value={form.startDate} onChange={e=>set({startDate:e.target.value})}/>
          <div>
            <label style={{display:'block',fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',marginBottom:'var(--space-2)'}}>Notes</label>
            <textarea style={{width:'100%',padding:'var(--space-3)',fontFamily:'var(--font-body)',fontSize:'var(--text-sm)',border:'1px solid var(--border-default)',borderRadius:'var(--radius-lg)',resize:'vertical',outline:'none',minHeight:80}} value={form.notes} onChange={e=>set({notes:e.target.value})} placeholder="Previous cycle history, protocol rationale..."/>
          </div>
        </div>
      </Modal>
    </div>
  )
}