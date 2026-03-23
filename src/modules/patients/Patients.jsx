import { Routes, Route } from 'react-router-dom'
import PatientList from './PatientList'
import PatientNew from './PatientNew'
import PatientProfile from './PatientProfile'
import EditPatient from './EditPatient'   // add this

export default function Patients() {
  return (
    <Routes>
      <Route index element={<PatientList />} />
      <Route path="new" element={<PatientNew />} />
      <Route path=":id" element={<PatientProfile />} />
      <Route path=":id/edit" element={<EditPatient />} />  {/* add this */}
    </Routes>
  )
}