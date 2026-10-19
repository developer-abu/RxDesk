/**
 * AuthContext.jsx
 *
 * Global authentication state for RxDesk with arrow functions.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const response = await authService.getMe();
        if (!cancelled) {
          setDoctor(response?.data?.doctor || response?.doctor || null);
        }
      } catch {
        if (!cancelled) setDoctor(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const loggedInDoctor = response?.data?.doctor || response?.doctor;
    setDoctor(loggedInDoctor);
    return response;
  }, []);

  const registerAndVerify = useCallback(async (registrationData) => {
    const regResponse = await authService.register(registrationData);
    return regResponse;
  }, []);

  const verifyAndLogin = useCallback(async (verifyData) => {
    const response = await authService.verifyEmail(verifyData);
    const verifiedDoctor = response?.data?.doctor || response?.doctor;
    setDoctor(verifiedDoctor);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setDoctor(false);
    }
  }, []);

  const value = {
    doctor,
    isAuthenticated: Boolean(doctor),
    isLoading,
    login,
    logout,
    registerAndVerify,
    verifyAndLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
