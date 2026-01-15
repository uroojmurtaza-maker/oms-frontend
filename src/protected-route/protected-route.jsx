import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to='/' replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to='/unauthorized' replace />;
  }

  return children;
};

export default ProtectedRoute;
