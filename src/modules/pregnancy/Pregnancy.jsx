import { Routes, Route } from 'react-router-dom'
import PregnancyList from './PregnancyList'
import PregnancyNew         from './PregnancyNew'
import ANCVisit             from './ANCVisit'
import PregnancyPatientView from './PregnancyPatientView'

export default function Pregnancy() {
  return (
    <Routes>
      <Route index               element={<PregnancyList />} />
      <Route path="new"          element={<PregnancyNew />} />
      <Route path="patient/:id"  element={<PregnancyPatientView />} />
      <Route path="visit/:id"    element={<ANCVisit />} />
    </Routes>
  )
}