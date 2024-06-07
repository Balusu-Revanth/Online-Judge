import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (user) {
      user.getIdToken().then(idToken => {
        setToken(idToken);
        localStorage.setItem('token', idToken);
      });
    } else {
      setToken(null);
      setAdmin(false);
      localStorage.removeItem('token');
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    admin,
    setAdmin,
    token,
    setToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
