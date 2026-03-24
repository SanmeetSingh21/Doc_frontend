import { Routes, Route } from 'react-router-dom'
import UltrasoundList from './UltrasoundList'
import UltrasoundPatientView from './UltrasoundPatientView'
import UltrasoundNew from './UltrasoundNew'

export default function Ultrasound() {
  return (
    <Routes>
      <Route index              element={<UltrasoundList />} />
      <Route path="new"         element={<UltrasoundNew />} />
      <Route path="patient/:id" element={<UltrasoundPatientView />} />
    </Routes>
  )
}