import { Routes, Route } from 'react-router-dom'
import UltrasoundList from './UltrasoundList'
import UltrasoundPatientView from './UltrasoundPatientView'

export default function Ultrasound() {
  return (
    <Routes>
      <Route index              element={<UltrasoundList />} />
      <Route path="patient/:id" element={<UltrasoundPatientView />} />
    </Routes>
  )
}