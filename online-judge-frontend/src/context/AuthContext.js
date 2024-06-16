import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
const API_URL = process.env.REACT_APP_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async (idToken) => {
      try {
        const response = await fetch(`${API_URL}/user/get-user`, {
          headers: {
            Authorization: idToken,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (user && !isNewUser) {
      user.getIdToken().then((idToken) => {
        setToken(idToken);
        localStorage.setItem("token", idToken);
        fetchUserDetails(idToken);
      });
    } else {
      setToken(null);
      setAdmin(false);
      localStorage.removeItem("token");
    }
  }, [user, isNewUser]);

  const value = {
    user,
    loading,
    error,
    admin,
    token,
    setIsNewUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
