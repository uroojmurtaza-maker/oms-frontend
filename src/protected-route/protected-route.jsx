import { useAuth } from '../context/authContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // to remember where user wanted to go

  // 1. Show loading first (prevents flash of content)
  if (loading) {
    return <div>Loading...</div>; // or better: <Spinner fullPage />
  }

  // 2. Not logged in → redirect to login with return path
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Logged in, but has requiredRole check
  if (requiredRole && user.role !== requiredRole) {
    // Option A: Redirect to home/dashboard
    // return <Navigate to="/" replace />;

    // Option B: Better UX - show access denied or redirect to user dashboard
    return <Navigate to="/unauthorized" replace />; // create this page if you want

    // Option C: Most flexible - redirect back to intended page after role fix (rare)
    // return <Navigate to="/" state={{ message: "Access denied" }} replace />;
  }

  // 4. All good → show protected content
  return children;
};

export default ProtectedRoute;