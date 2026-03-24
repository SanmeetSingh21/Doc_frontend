import { Routes, Route } from 'react-router-dom'
import UltrasoundList from './UltrasoundList'
import UltrasoundPatientView from './UltrasoundPatientView'
import UltrasoundForm from './UltrasoundForm'

export default function Ultrasound() {
  return (
    <Routes>
      <Route index              element={<UltrasoundList />} />
      <Route path="new"         element={<UltrasoundForm />} />
      <Route path="edit/:id"    element={<UltrasoundForm />} />
      <Route path="patient/:id" element={<UltrasoundPatientView />} />
    </Routes>
  )
}