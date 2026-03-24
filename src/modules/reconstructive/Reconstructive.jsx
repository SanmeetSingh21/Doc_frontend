import { Routes, Route } from 'react-router-dom'
import ReconstructiveList from './ReconstructiveList'
import ReconstructivePatientView from './ReconstructivePatientView'

export default function Reconstructive() {
  return (
    <Routes>
      <Route index              element={<ReconstructiveList />} />
      <Route path="patient/:id" element={<ReconstructivePatientView />} />
      {/* <Route path="new"         element={<ProcedureNew />} /> */}
      {/* <Route path="edit/:id"    element={<ProcedureNew />} /> */}
    </Routes>
  )
}