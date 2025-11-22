import { createContext, useContext, useState, useEffect } from 'react';

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
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: '1',
      email: email,
      name: 'John Doe',
      role: 'Admin'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const signup = (name, email, password) => {
    // Mock signup
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      name: name,
      role: 'User'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const resetPassword = (email) => {
    // Mock password reset
    return Promise.resolve({ success: true });
  };

  const verifyOTP = (otp) => {
    // Mock OTP verification
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