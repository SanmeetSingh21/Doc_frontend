import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, Scan, FileText } from 'lucide-react'
import { Card } from '@components/ui/Card'
import Button from '@components/ui/Button'
import Badge from '@components/ui/Badge'
import { patientApi } from '@services/api'

export default function UltrasoundPatientView() {
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
      
      // Filter for ultrasound type episodes
      eData = eData.filter(ep => ep.type?.toLowerCase() === 'ultrasound')
      eData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      // Sort scans within episodes
      eData.forEach(ep => {
        if (ep.ultrasounds) {
          ep.ultrasounds.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
        onClick={() => navigate('/ultrasound')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', padding: '16px', color: 'var(--clr-primary-600)', fontWeight: 500 }}
      >
        <ArrowLeft size={16}/> Back to Ultrasound List
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)' }}>Imaging History: {patient.name}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>Patient ID: {patient.id?.slice(0,8)} · Age: {patient.age || '—'}</p>
        </div>
        
        <Button icon={Plus} onClick={() => {
          if (latestEpisode) {
            navigate(`/ultrasound/new?episodeId=${latestEpisode.id}&patientId=${patient.id}`)
          } else {
            alert("No active Imaging episode. Please add an Ultrasound episode from the Patients screen first.")
          }
        }}>
          New Scan
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 16px' }}>
        {episodes.length === 0 ? (
          <Card padding="md"><p style={{color: 'var(--text-muted)', margin: 0}}>No imaging history recorded for this patient.</p></Card>
        ) : (
          episodes.map(episode => {
            const scans = episode.ultrasounds || []

            return (
              <div key={episode.id}>
                <Card padding="md" style={{ marginBottom: '16px', background: 'var(--clr-slate-50)', border: '1px solid var(--clr-gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: 'var(--text-primary)' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Episode Date:</strong> <br/>{new Date(episode.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium'})}</div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>Type:</strong> <br/>
                        <Badge variant="primary" size="sm">{episode.title || 'Imaging Episode'}</Badge>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-muted)' }}>Status:</strong> <br/>
                        <Badge variant={episode.episodeStatus === 'active' ? 'success' : 'default'} dot>{episode.episodeStatus}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <h4 style={{ margin: '0 0 12px 16px', color: 'var(--text-secondary)' }}>Scans & Reports ({scans.length})</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '16px' }}>
                  {scans.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No scan reports found in this episode.</p>
                  ) : (
                    scans.map(scan => (
                      <Card key={scan.id} padding="md" style={{ borderLeft: '4px solid var(--clr-primary-400)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--clr-gray-200)' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: '600', color: 'var(--text-primary)' }}>
                            <Scan size={18} style={{ color: 'var(--clr-primary-600)' }}/>
                            {scan.scanType?.replace(/_/g, ' ')}
                            <Badge variant={scan.scanCategory?.toLowerCase() === 'obstetric' ? 'teal' : 'default'} size="sm">{scan.scanCategory}</Badge>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '14px' }}>| {new Date(scan.scanDate || scan.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                             <Button size="sm" variant="ghost" icon={FileText} onClick={() => window.open(scan.reportUrl, '_blank')}>View PDF</Button>
                             <Button size="sm" variant="outline" onClick={() => navigate(`/ultrasound/edit/${scan.id}`)}>Edit</Button>
                          </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                          {scan.findings && (
                            <div>
                              <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500, fontSize: '14px' }}>Findings</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                {typeof scan.findings === 'string' ? scan.findings : JSON.stringify(scan.findings, null, 2)}
                              </div>
                            </div>
                          )}
                          <div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500, fontSize: '14px' }}>Impression</div>
                            <div style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '500' }}>{scan.impression || '—'}</div>
                          </div>
                          {scan.reportNotes && (
                            <div style={{ padding: '12px', background: 'var(--clr-gray-50)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                              <strong style={{ display: 'block', marginBottom: '4px' }}>Clinical Notes:</strong>
                              {scan.reportNotes}
                            </div>
                          )}
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
