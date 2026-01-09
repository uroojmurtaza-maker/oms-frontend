// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Helper function to get initial state from localStorage
const getInitialAuthState = () => {
  try {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      return {
        token: storedToken,
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error reading auth state from localStorage:', error);
    // Clean up corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialAuthState();
  const [user, setUser] = useState(initialState.user);
  const [token, setToken] = useState(initialState.token);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Login: sets user + token + isAuthenticated
  const login = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    setIsAuthenticated(true);
    setError(null);

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout: clears everything
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Optional: helper to update only user data (e.g. after profile update)
  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedUserData };
      // Also update localStorage so refresh doesn't lose the changes
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    // State
    user,
    token,
    isAuthenticated,
    error,

    // Setters
    setUser,             // ← you can now use this directly
    setToken,
    setIsAuthenticated,
    setError,

    // Helper functions
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};