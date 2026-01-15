import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './containers/login/login';
import AddEmployee from './containers/employees/add-employee/add-employee';
import EditEmployee from './containers/employees/add-employee/add-employee';
import EmployeeProfile from './containers/employees/employee-profile/employee-profile';
import EmployeesListing from './containers/employees/employee-listing/employee-listing';
import ProtectedRoute from './protected-route/protected-route';
import Unauthorized from './containers/unauthorized/unathorized';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <EmployeesListing />
            </ProtectedRoute>
          }
        />
        <Route
          path='/add-employee'
          element={
            <ProtectedRoute requiredRole='Admin'>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path='/edit-employee/:id'
          element={
            <ProtectedRoute requiredRole='Admin'>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path='/employee-profile/:id'
          element={
            <ProtectedRoute requiredRole='Admin'>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/edit-profile/:id'
          element={
            <ProtectedRoute>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
