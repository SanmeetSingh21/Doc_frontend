import { useState } from 'react'
import { MessageSquare, Send, Bell, Phone, Mail } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import Select from '@components/ui/Select'
import styles from './Engagement.module.css'

const CHANNELS = ['WhatsApp', 'SMS', 'Email']
const REMINDER_TYPES = ['ANC Visit Due', 'Follicular Monitoring', 'Medication Reminder', 'Appointment Reminder', 'Lab Report Ready', 'Follow-up Due']

const MOCK_MESSAGES = [
  { id:'M001', patient:'Priya Sharma',  channel:'WhatsApp', type:'ANC Visit Due',       sentAt:'10 Mar 09:00', status:'delivered' },
  { id:'M002', patient:'Anita Gupta',   channel:'WhatsApp', type:'Follicular Monitoring',sentAt:'10 Mar 08:30', status:'read'      },
  { id:'M003', patient:'Deepa Nair',    channel:'SMS',      type:'Medication Reminder',  sentAt:'09 Mar 20:00', status:'delivered' },
  { id:'M004', patient:'Lakshmi Iyer',  channel:'Email',    type:'Appointment Reminder', sentAt:'09 Mar 18:00', status:'opened'    },
  { id:'M005', patient:'Meena Pillai',  channel:'WhatsApp', type:'Lab Report Ready',     sentAt:'08 Mar 14:00', status:'read'      },
]

const STATUS_VARIANT = { delivered:'teal', read:'success', opened:'success', failed:'danger', pending:'warning' }
const CHANNEL_ICON   = { WhatsApp: '💬', SMS: '📱', Email: '📧' }

export default function Engagement() {
  const [channel,      setChannel]      = useState('WhatsApp')
  const [reminderType, setReminderType] = useState('')
  const [message,      setMessage]      = useState('')

  return (
    <div className="page-container">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Patient Engagement</h1>
          <p className={styles.pageSub}>Communication and reminders</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Compose panel */}
        <div className={styles.composeCol}>
          <Card padding="md">
            <h3 className={styles.cardTitle}>Send Reminder</h3>

            <div className={styles.channelRow}>
              {CHANNELS.map(c=>(
                <button key={c}
                  className={`${styles.channelBtn} ${channel===c?styles.channelActive:''}`}
                  onClick={()=>setChannel(c)}>
                  <span>{CHANNEL_ICON[c]}</span>{c}
                </button>
              ))}
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',marginTop:'var(--space-4)'}}>
              <Select label="Reminder Type" value={reminderType}
                onChange={e=>setReminderType(e.target.value)}
                options={REMINDER_TYPES} placeholder="Select type"/>
              <div>
                <label className={styles.msgLabel}>Message</label>
                <textarea className={styles.msgArea} rows={5}
                  value={message} onChange={e=>setMessage(e.target.value)}
                  placeholder={`Type your ${channel} message here...`}/>
              </div>
              <Button icon={Send} fullWidth
                onClick={()=>alert(`${channel} sent!`)}>
                Send via {channel}
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <Card padding="md">
            <h3 className={styles.cardTitle}>This Month</h3>
            <div className={styles.engagementStats}>
              {[
                { icon:'💬', label:'WhatsApp sent', value:'124' },
                { icon:'📱', label:'SMS sent',      value:'48'  },
                { icon:'📧', label:'Emails sent',   value:'32'  },
                { icon:'✅', label:'Read rate',     value:'76%' },
              ].map(s=>(
                <div key={s.label} className={styles.engStat}>
                  <span className={styles.engIcon}>{s.icon}</span>
                  <div>
                    <div className={styles.engValue}>{s.value}</div>
                    <div className={styles.engLabel}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Message log */}
        <div className={styles.logCol}>
          <Card padding="none">
            <div className={styles.logHeader}>
              <h3 className={styles.cardTitle} style={{margin:0}}>Message Log</h3>
              <Badge variant="default">{MOCK_MESSAGES.length} sent today</Badge>
            </div>
            <div className={styles.logList}>
              {MOCK_MESSAGES.map(m=>(
                <div key={m.id} className={styles.logItem}>
                  <div className={styles.logChannel}>{CHANNEL_ICON[m.channel]}</div>
                  <div className={styles.logBody}>
                    <div className={styles.logPatient}>{m.patient}</div>
                    <div className={styles.logType}>{m.type}</div>
                    <div className={styles.logTime}>{m.sentAt}</div>
                  </div>
                  <Badge variant={STATUS_VARIANT[m.status]} size="sm">{m.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Scheduled reminders */}
          <Card padding="md">
            <h3 className={styles.cardTitle}>Upcoming Reminders</h3>
            <div className={styles.reminderList}>
              {[
                { patient:'Priya Sharma',  type:'ANC Visit',         due:'Tomorrow',    channel:'WhatsApp' },
                { patient:'Anita Gupta',   type:'Follicular Study',  due:'14 Mar',      channel:'WhatsApp' },
                { patient:'Lakshmi Iyer',  type:'Delivery Prep',     due:'15 Mar',      channel:'SMS'      },
                { patient:'Meena Pillai',  type:'ANC Visit',         due:'16 Mar',      channel:'Email'    },
              ].map((r,i)=>(
                <div key={i} className={styles.reminderItem}>
                  <div className={styles.reminderLeft}>
                    <span className={styles.reminderChannel}>{CHANNEL_ICON[r.channel]}</span>
                    <div>
                      <div className={styles.reminderPatient}>{r.patient}</div>
                      <div className={styles.reminderType}>{r.type}</div>
                    </div>
                  </div>
                  <div className={styles.reminderRight}>
                    <Badge variant="warning" size="sm">{r.due}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}