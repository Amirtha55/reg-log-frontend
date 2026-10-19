import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on initial load
  useEffect(() => {
    try {
      const existingUser = getCurrentUser();
      if (existingUser) {
        setCurrentUser(existingUser);
      }
    } catch (err) {
      console.error('Failed to load initial auth state', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Login
  const login = async (email, password) => {
    const result = await loginUser(email, password);
    setCurrentUser(result.user);
    return result;
  };

  // Handle Register
  const register = async (userData) => {
    const result = await registerUser(userData);
    setCurrentUser(result.user);
    return result;
  };

  // Handle Logout
  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for convenient consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
