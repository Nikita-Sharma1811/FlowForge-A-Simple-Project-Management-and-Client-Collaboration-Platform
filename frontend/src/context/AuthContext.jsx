import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { flowForgeApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await flowForgeApi.auth.me();
          if (response.status && response.data) {
            setUser(response.data);
            setAuthToken(token);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or server offline:', err.message);
          // Fall back to stored user object if available
          const storedUser = localStorage.getItem('authUser');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              logout();
            }
          }
        }
      }
      setIsHydrated(true);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      setAuthToken(token);
      localStorage.setItem('authToken', token);
    }
    if (userData) {
      localStorage.setItem('authUser', JSON.stringify(userData));
    }
  };

  const register = (userData, token) => {
    login(userData, token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const value = useMemo(
    () => ({
      user,
      authToken,
      isHydrated,
      loading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, authToken, isHydrated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
