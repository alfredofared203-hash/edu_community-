import { createContext, useContext, useState, useEffect } from "react";
import { api, tokenStore } from "../lib/api";

const AuthContext = createContext(undefined);

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const userData = rawUser.user ?? rawUser;
  if (!userData || typeof userData !== "object") return null;
  return {
    ...userData,
    role: userData.role ? String(userData.role).toLowerCase() : userData.role,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!tokenStore.getAccess()) {
      setUser(null);
      return null;
    }

    try {
      const res = await api.getMe();
      const userData = normalizeUser(res);
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Session validation failed:", err);
      tokenStore.clear();
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (!tokenStore.getAccess()) {
        setLoading(false);
        return;
      }

      await refreshUser();
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      const accessToken = res?.accessToken || res?.data?.accessToken;
      const refreshToken = res?.refreshToken || res?.data?.refreshToken;

      tokenStore.set(accessToken, refreshToken);

      const userData = normalizeUser(res?.user || res?.data?.user || res);
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      const accessToken = res?.accessToken || res?.data?.accessToken;
      const refreshToken = res?.refreshToken || res?.data?.refreshToken;

      tokenStore.set(accessToken, refreshToken);

      const userObj = normalizeUser(res?.user || res?.data?.user || res);
      setUser(userObj);
      return userObj;
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout?.();
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      tokenStore.clear();
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
