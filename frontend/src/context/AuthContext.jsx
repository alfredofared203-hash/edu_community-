import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // بيانات المستخدم الحالي
  const [loading, setLoading] = useState(true); // بننتظر لحد ما نتأكد من الدخول

  // أول ما التطبيق يفتح: لو فيه توكن محفوظ، نجيب بيانات المستخدم
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem("token")) // لو التوكن قديم نمسحه
      .finally(() => setLoading(false));
  }, []);

  // تسجيل الدخول: نحفظ التوكن ونحط بيانات المستخدم
  async function login(credentials) {
    const res = await api.login(credentials);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res.user;
  }

  // تسجيل حساب جديد
  async function register(data) {
    const res = await api.register(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
    return res.user;
  }

  // تسجيل الخروج: نمسح التوكن
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // نحدّث بيانات المستخدم (مثلاً بعد ما ياخد نقاط)
  async function refreshUser() {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
