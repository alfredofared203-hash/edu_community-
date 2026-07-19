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

const getAuthData = (response) => {
  const payload = response?.data ?? response;
  const accessToken = payload?.accessToken;
  const refreshToken = payload?.refreshToken;
  const user = normalizeUser(payload?.user);

  if (!accessToken || !user?.name || !user?.role) {
    throw new Error("استجابة تسجيل الدخول غير مكتملة. حاول تسجيل الدخول مرة أخرى.");
  }

  return { accessToken, refreshToken, user };
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
      const { accessToken, refreshToken, user: userData } = getAuthData(res);

      tokenStore.set(accessToken, refreshToken);
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
      const { accessToken, refreshToken, user: userObj } = getAuthData(res);

      tokenStore.set(accessToken, refreshToken);
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
