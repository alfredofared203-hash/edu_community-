import { createContext, useContext, useState, useEffect } from "react";
import { api, tokenStore } from "../lib/api";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshUser = async () => {
    if (!tokenStore.getAccess()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch (err) {
      console.error("Session validation failed:", err);
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refreshUser();
  }, []);
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      tokenStore.set(res.accessToken, res.refreshToken);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      tokenStore.set(res.accessToken, res.refreshToken);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    api.logout();
    tokenStore.clear();
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>;
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export {
  AuthProvider,
  useAuth
};
