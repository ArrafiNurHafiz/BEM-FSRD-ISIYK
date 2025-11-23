import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, user } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error types
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Server tidak dapat dijangkau. Pastikan backend server berjalan.'
        };
      }
      
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        let errorMessage = errorData?.message || `Error: ${error.response.status} - ${error.response.statusText}`;
        
        // Add more details for 500 errors
        if (error.response.status === 500) {
          if (errorData?.error) {
            errorMessage += ` (${errorData.error})`;
          }
          errorMessage += '. Periksa terminal backend untuk detail error.';
        }
        
        return {
          success: false,
          message: errorMessage
        };
      }
      
      return {
        success: false,
        message: error.message || 'Login gagal. Periksa koneksi internet dan pastikan server berjalan.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

