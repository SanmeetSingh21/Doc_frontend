import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, Activity, CheckCircle, FileText, Settings, Image } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { patientApi } from '@services/api'
import styles from './Reconstructive.module.css'

export default function ReconstructivePatientView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      patientApi.getById(id),
      patientApi.getTimeline(id)
    ]).then(([pRes, eRes]) => {
      const pData = pRes.data?.data || pRes.data
      let eData = eRes.data?.data || eRes.data
      if (!Array.isArray(eData)) eData = []
      
      // Filter for procedure type episodes
      eData = eData.filter(ep => ep.type?.toLowerCase() === 'procedure')
      eData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      // Sort procedures and their sessions
      eData.forEach(ep => {
        if (ep.procedures) {
          ep.procedures.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          ep.procedures.forEach(proc => {
            if (proc.sessions) {
              proc.sessions.sort((a,b) => b.sessionNumber - a.sessionNumber)
            }
          })
        }
      })
      
      setPatient(pData)
      setEpisodes(eData)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading history...</p></div>
  if (!patient) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--clr-danger-600)' }}>Patient not found.</p></div>

  const latestEpisode = episodes[0]

  return (
    <div className="page-container" style={{ paddingBottom: '64px' }}>
      <button 
        onClick={() => navigate('/reconstructive')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back to Procedure List
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>Procedure History: {patient.name}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>Patient ID: {patient.id?.slice(0,8)} · Age: {patient.age || '—'}</p>
        </div>
        
        <Button icon={Plus} onClick={() => {
           if (latestEpisode) {
             navigate(`/reconstructive/new?episodeId=${latestEpisode.id}&patientId=${patient.id}`)
           } else {
             alert("No active Procedure episode. Please add a Procedure episode from the Patients screen first.")
           }
        }}>
          New Procedure
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 16px' }}>
        {episodes.length === 0 ? (
          <Card padding="md"><p style={{color: 'var(--text-muted)', margin: 0}}>No procedural history recorded for this patient.</p></Card>
        ) : (
          episodes.map(episode => {
            const procedures = episode.procedures || []

            return (
              <div key={episode.id}>
                <Card padding="md" style={{ marginBottom: '16px', background: 'var(--clr-slate-50)', border: '1px solid var(--clr-gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Episode Date:</strong> <br/>{new Date(episode.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>Episode Status:</strong> <br/>
                        <Badge variant={episode.episodeStatus === 'active' ? 'success' : 'default'} dot>{episode.episodeStatus}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '16px' }}>
                  {procedures.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No procedures found in this episode.</p>
                  ) : (
                    procedures.map(proc => (
                      <div key={proc.id}>
                        <Card padding="md" style={{ borderLeft: '4px solid var(--clr-primary-600)', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--clr-gray-100)', paddingBottom: '12px' }}>
                             <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                               <Activity size={18} style={{ color: 'var(--clr-primary-600)' }}/>
                               <span style={{ fontWeight: '600', fontSize: '16px' }}>{proc.procedureType?.replace(/_/g, ' ')}</span>
                               <Badge variant={(proc.consents?.length > 0) ? 'success' : 'danger'} size="sm">
                                 {(proc.consents?.length > 0) ? 'Consent Signed' : 'Consent Pending'}
                               </Badge>
                             </div>
                             <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                               Status: <Badge variant={proc.status === 'completed' ? 'success' : 'warning'} dot>{proc.status}</Badge>
                             </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                             <div>
                               <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>Clinical Progress</div>
                               <div style={{ fontSize: '14px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{proc.clinicalNotes || 'No clinical notes recorded.'}</div>
                             </div>
                             <div style={{ background: 'var(--clr-gray-50)', padding: '12px', borderRadius: '8px' }}>
                               <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600' }}>Session Progress</div>
                               <div className={styles.sessionBar}>
                                 <div className={styles.sessionTrack}>
                                   {Array.from({ length: proc.plannedSessions || 1 }).map((_, i) => (
                                     <div key={i} className={`${styles.sessionDot} ${i < (proc.sessions?.length || 0) ? styles.sessionDone : ''}`} />
                                   ))}
                                 </div>
                                 <span className={styles.sub}>{proc.sessions?.length || 0}/{proc.plannedSessions}</span>
                               </div>
                               <Button size="sm" variant="outline" style={{ width: '100%', marginTop: '12px' }} icon={Plus}>Add Session</Button>
                             </div>
                          </div>
                        </Card>

                        {/* Sessions List */}
                        <div style={{ display: 'grid', gap: '12px', marginLeft: '24px' }}>
                          {proc.sessions?.map(session => (
                            <div key={session.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                              <div style={{ background: 'var(--clr-primary-50)', color: 'var(--clr-primary-600)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                                #{session.sessionNumber}
                              </div>
                              <div style={{ flex: 1, padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid var(--clr-gray-200)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-primary)' }}>
                                    Session {session.sessionNumber} · <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>{new Date(session.sessionDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '12px' }}>
                                    {session.energySettings && <Badge variant="default" size="sm" icon={Settings}>{session.energySettings}</Badge>}
                                    {(session.beforeImageUrl || session.afterImageUrl) && <Badge variant="teal" size="sm" icon={Image}>Clinical Photos</Badge>}
                                  </div>
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{session.notes}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
