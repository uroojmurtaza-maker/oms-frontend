
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './containers/login/login'
import Dashboard from './containers/dashboard/dashboard'
import AddEmployee from './containers/employees/add-employee/add-employee'

function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-employee" element={<AddEmployee />} />
     </Routes>
    </>
  )
}

export default App
