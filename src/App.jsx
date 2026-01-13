
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './containers/login/login'
import Dashboard from './containers/dashboard/dashboard'
import AddEmployee from './containers/employees/add-employee/add-employee'
import EditEmployee from './containers/employees/add-employee/add-employee'
import EmployeeProfile from './containers/employees/employee-profile/employee-profile'

function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/edit-employee/:id" element={<EditEmployee />} />
      <Route path="/employee-profile/:id" element={<EmployeeProfile />} />
     </Routes>
    </>
  )
}

export default App
