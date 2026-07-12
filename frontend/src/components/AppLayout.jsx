import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Trophy,
  BarChart3,
  Star,
  User,
  Shield,
  Menu,
  X,
  GraduationCap,
  LogOut,
  BookOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems = [
    { path: "/feed", label: "\u0627\u0644\u0645\u062C\u062A\u0645\u0639", icon: MessageSquare },
    { path: "/materials", label: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A\u0629", icon: BookOpen },
    { path: "/challenges", label: "\u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A", icon: Trophy },
    { path: "/leaderboard", label: "\u0627\u0644\u0645\u062A\u0635\u062F\u0631\u0648\u0646", icon: BarChart3 },
    { path: "/teachers", label: "\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646", icon: Star },
    { path: "/profile", label: "\u0645\u0644\u0641\u064A \u0627\u0644\u0634\u062E\u0635\u064A", icon: User },
    ...user?.role === "admin" ? [{ path: "/admin", label: "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645", icon: Shield }] : []
  ];
  const getRoleLabel = (role) => {
    switch (role) {
      case "student":
        return "\u0637\u0627\u0644\u0628";
      case "teacher":
        return "\u0645\u0639\u0644\u0645";
      case "admin":
        return "\u0645\u062F\u064A\u0631";
      case "supervisor":
        return "\u0645\u0634\u0631\u0641";
      default:
        return "\u0632\u0627\u0626\u0631";
    }
  };
  const getGradeLabel = (grade) => {
    if (!grade) return "";
    switch (grade) {
      case "primary-1":
        return "\u0627\u0644\u0623\u0648\u0644 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-2":
        return "\u0627\u0644\u062B\u0627\u0646\u064A \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-3":
        return "\u0627\u0644\u062B\u0627\u0644\u062B \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-4":
        return "\u0627\u0644\u0631\u0627\u0628\u0639 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-5":
        return "\u0627\u0644\u062E\u0627\u0645\u0633 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-6":
        return "\u0627\u0644\u0633\u0627\u062F\u0633 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "prep-1":
        return "\u0627\u0644\u0623\u0648\u0644 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u064A";
      case "prep-2":
        return "\u0627\u0644\u062B\u0627\u0646\u064A \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u064A";
      case "prep-3":
        return "\u0627\u0644\u062B\u0627\u0644\u062B \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u064A";
      case "sec-1":
        return "\u0627\u0644\u0623\u0648\u0644 \u0627\u0644\u062B\u0627\u0646\u0648\u064A";
      case "sec-2":
        return "\u0627\u0644\u062B\u0627\u0646\u064A \u0627\u0644\u062B\u0627\u0646\u0648\u064A";
      case "sec-3":
        return "\u0627\u0644\u062B\u0627\u0644\u062B \u0627\u0644\u062B\u0627\u0646\u0648\u064A";
      default:
        return grade;
    }
  };
  return <div className="flex min-h-screen"><AnimatePresence>{sidebarOpen && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />}</AnimatePresence><aside
    className={`fixed inset-y-0 right-0 z-50 w-64 gradient-hero text-sidebar-foreground transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "translate-x-full"} lg:order-first lg:right-auto lg:left-auto`}
  ><div className="flex flex-col h-full"><div className="flex items-center gap-3 p-6 border-b border-sidebar-border"><div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-accent"><GraduationCap className="w-6 h-6 text-accent-foreground" /></div><div><h1 className="text-lg font-display font-bold text-sidebar-foreground">مجتمع التعليم</h1><p className="text-xs text-sidebar-foreground/60">مصر 🇪🇬</p></div><button
    className="mr-auto lg:hidden text-sidebar-foreground/70"
    onClick={() => setSidebarOpen(false)}
  ><X className="w-5 h-5" /></button></div><nav className="flex-1 p-4 space-y-1">{navItems.map((item) => {
    const isActive = location.pathname === item.path;
    return <Link
      key={item.path}
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}
    ><item.icon className="w-5 h-5" />{item.label}{isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />}</Link>;
  })}</nav><div className="p-4 border-t border-sidebar-border"><div className="flex items-center gap-3 px-3 py-2"><div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-sm font-bold text-accent-foreground shrink-0">{user ? user.name.charAt(0) : "\u0632"}</div><div className="flex-1 min-w-0 font-medium"><p className="text-sm text-sidebar-foreground truncate">{user ? user.name : "\u0632\u0627\u0626\u0631"}</p><p className="text-xs text-sidebar-foreground/50 truncate">{user ? `${getGradeLabel(user.grade) || getRoleLabel(user.role)}` : "\u062A\u0635\u0641\u062D \u0645\u062D\u062F\u0648\u062F"}</p></div>{user ? <button
    onClick={() => {
      logout();
      navigate("/");
    }}
    className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
    title="تسجيل الخروج"
  ><LogOut className="w-4 h-4" /></button> : <Link to="/" className="text-sidebar-foreground/50 hover:text-sidebar-foreground text-xs font-semibold">
                  دخول
                </Link>}</div></div></div></aside><div className="flex-1 flex flex-col min-w-0"><header className="sticky top-0 z-30 glass-card border-b px-4 py-3 lg:px-6"><div className="flex items-center gap-4"><button
    className="lg:hidden text-muted-foreground hover:text-foreground"
    onClick={() => setSidebarOpen(true)}
  ><Menu className="w-6 h-6" /></button><div className="flex-1" /><div className="flex items-center gap-2 text-sm text-muted-foreground"><div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground"><Trophy className="w-4 h-4 text-accent" /><span className="font-semibold">{user?.points || 0} نقطة</span></div></div></div></header><main className="flex-1 p-4 lg:p-8"><motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >{children}</motion.div></main></div></div>;
};
var AppLayout_default = AppLayout;
export {
  AppLayout_default as default
};
