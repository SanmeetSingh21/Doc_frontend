import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, Baby, AlertTriangle } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { patientApi } from '@services/api'

export default function PregnancyPatientView() {
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
      
      // Filter out only pregnancy
      eData = eData.filter(ep => ep.type?.toLowerCase() === 'pregnancy')
      eData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      eData.forEach(ep => {
        ep.pregnancies?.forEach(preg => {
          if (preg.ancVisits) {
             preg.ancVisits.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          }
        })
      })
      
      setPatient(pData)
      setEpisodes(eData)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading patient history...</p></div>
  if (!patient) return <div className="page-container"><p style={{ padding: '24px', color: 'var(--clr-danger-600)' }}>Patient not found.</p></div>

  const latestEpisode = episodes[0]

  return (
    <div className="page-container" style={{ paddingBottom: '64px' }}>
      <button 
        onClick={() => navigate('/pregnancy')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back to Pregnancy List
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>Pregnancy History: {patient.name}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>Patient ID: {patient.id?.slice(0,8)} · Age: {patient.age || '—'}</p>
        </div>
        
        <Button icon={Plus} onClick={() => {
          if (latestEpisode) {
            navigate(`/pregnancy/new?episodeId=${latestEpisode.id}&patientId=${patient.id}`)
          } else {
            alert("No active Pregnancy episode. Please add a Pregnancy episode from the Patients screen first.")
          }
        }}>
          New ANC Visit
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 16px' }}>
        {episodes.length === 0 ? (
          <Card padding="md"><p style={{color: 'var(--text-muted)', margin: 0}}>No Pregnancy history recorded for this patient.</p></Card>
        ) : (
          episodes.map(episode => {
            const primaryPreg = episode.pregnancies?.[0]
            const visits = primaryPreg?.ancVisits || []
            
            const lmpDate = primaryPreg?.lmp ? new Date(primaryPreg.lmp) : null
            const eddDate = lmpDate ? new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000) : null

            return (
              <div key={episode.id}>
                <Card padding="md" style={{ marginBottom: '16px', background: 'var(--clr-slate-50)', border: '1px solid var(--clr-gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Episode Date:</strong> <br/>{new Date(episode.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>LMP & EDD:</strong> <br/>
                        {lmpDate ? `LMP: ${lmpDate.toLocaleDateString('en-IN')}` : '—'} <br/>
                        {eddDate ? `EDD: ${eddDate.toLocaleDateString('en-IN')}` : ''}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>Status:</strong> <br/>
                        <Badge variant={episode.episodeStatus === 'active' ? 'success' : 'default'} dot>{episode.episodeStatus}</Badge>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>Risks:</strong> <br/>
                        {primaryPreg?.risks?.length > 0 ? (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {primaryPreg.risks.map(r => (
                              <Badge key={r} variant="danger" size="sm"><AlertTriangle size={10}/> {r}</Badge>
                            ))}
                          </div>
                        ) : 'None'}
                      </div>
                    </div>
                  </div>
                </Card>

                <h4 style={{ margin: '0 0 12px 16px', color: 'var(--text-secondary)' }}>ANC Visits ({visits.length})</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '16px' }}>
                  {visits.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No ANC visits found in this episode.</p>
                  ) : (
                    visits.map(v => (
                      <Card key={v.id} padding="md" style={{ borderLeft: '4px solid var(--clr-accent-400)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--clr-gray-200)' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: '600', color: 'var(--text-primary)' }}>
                            <Calendar size={16} style={{ color: 'var(--clr-accent-600)' }}/>
                            {new Date(v.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                            <span style={{ margin: '0 8px', color: 'var(--text-muted)', fontWeight: 'normal' }}>|</span> 
                            <Baby size={16} style={{ color: 'var(--clr-accent-600)' }}/>
                            {v.weeksOfGestation || '—'} Weeks
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/pregnancy/visit/${v.id}`)}>View Log</Button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Weight & BP</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{v.weight ? `${v.weight} kg` : '—'} / {v.bp || '—'}</div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>FHR</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{v.fhr || '—'}</div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Complaints</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{v.complaints || '—'}</div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Notes</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{v.notes || '—'}</div>
                          </div>
                        </div>
                      </Card>
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
