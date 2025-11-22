import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (loginIdOrEmail, password) => {
    try {
      const response = await authAPI.login({
        loginIdOrEmail,
        password,
      });
      
      const { token, user: userData } = response.data;
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const signup = async (loginId, email, password) => {
    try {
      const response = await authAPI.signup({
        loginId,
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Signup failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const resetPassword = async (email) => {
    // TODO: Implement when backend endpoint is available
    return Promise.resolve({ success: true });
  };

  const verifyOTP = async (otp) => {
    // TODO: Implement when backend endpoint is available
    return Promise.resolve({ success: true });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    verifyOTP
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};