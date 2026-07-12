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
      const userData = res?.user || res; 
      if (userData) {
        setUser({ ...userData, role: userData.role?.toLowerCase() });
      } else {
        setUser(null);
      }
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
      const accessToken = res?.accessToken || res?.data?.accessToken;
      const refreshToken = res?.refreshToken || res?.data?.refreshToken;
      
      tokenStore.set(accessToken, refreshToken);
      
      const rawUser = res?.user || res?.data?.user || res;
      const userObj = { ...rawUser, role: rawUser.role?.toLowerCase() };
      setUser(userObj);
      return userObj;
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
      
      const rawUser = res?.user || res?.data?.user || res;
      const userObj = { ...rawUser, role: rawUser.role?.toLowerCase() };
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
      await api.logout();
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