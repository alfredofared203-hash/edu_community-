import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  Trash2,
  ShieldAlert
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
const AdminDashboard = () => {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers()
      ]);
      setAdminStats(statsRes);
      setUsersList(usersRes.users);
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u062A\u062D\u0645\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminData();
    }
  }, [user]);
  const handleDeleteUser = async (userId) => {
    if (userId === user?.id) {
      toast.error("\u0644\u0627 \u064A\u0645\u0643\u0646\u0643 \u062D\u0630\u0641 \u062D\u0633\u0627\u0628\u0643 \u0627\u0644\u0634\u062E\u0635\u064A!");
      return;
    }
    if (!confirm("\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u0631\u063A\u0628\u062A\u0643 \u0641\u064A \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0646\u0647\u0627\u0626\u064A\u0627\u064B\u061F")) return;
    try {
      await api.deleteUser(userId);
      toast.success("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0646\u062C\u0627\u062D");
      setUsersList(usersList.filter((u) => u.id !== userId));
      const statsRes = await api.getAdminStats();
      setAdminStats(statsRes);
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645");
    }
  };
  if (!user || user.role !== "admin") {
    return <div className="max-w-md mx-auto text-center py-12 space-y-4 elevated-card rounded-2xl p-6 bg-card border"><ShieldAlert className="w-12 h-12 text-destructive mx-auto" /><h2 className="text-xl font-bold text-foreground">غير مصرح بالدخول</h2><p className="text-sm text-muted-foreground">هذه الصفحة مخصصة لمديري النظام والمشرفين فقط.</p></div>;
  }
  const studentCount = adminStats?.usersByRole?.find((u) => u.role === "student")?.count || "0";
  const teacherCount = adminStats?.usersByRole?.find((u) => u.role === "teacher")?.count || "0";
  const activeChallenges = adminStats?.activeChallenges || 0;
  const totalPosts = adminStats?.totalPosts || 0;
  const dashboardStats = [
    { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0627\u0628", value: studentCount, icon: Users, color: "text-primary" },
    { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646", value: teacherCount, icon: Activity, color: "text-success" },
    { label: "\u062A\u062D\u062F\u064A\u0627\u062A \u0646\u0634\u0637\u0629", value: String(activeChallenges), icon: Trophy, color: "text-amber-500" },
    { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0627\u062A", value: String(totalPosts), icon: BookOpen, color: "text-primary" }
  ];
  const getRoleLabel = (role) => {
    switch (role) {
      case "student":
        return "\u0637\u0627\u0644\u0628";
      case "teacher":
        return "\u0645\u0639\u0644\u0645";
      case "admin":
        return "\u0645\u062F\u064A\u0631";
      default:
        return role;
    }
  };
  const getGradeLabel = (grade) => {
    if (!grade) return "-";
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
  return <div className="max-w-5xl mx-auto space-y-6"><div><h1 className="text-2xl font-display font-bold text-foreground">لوحة التحكم الإدارية</h1><p className="text-muted-foreground mt-1">مراقبة تفاعل المنصة وإدارة حسابات المستخدمين</p></div>{loading ? <div className="text-center py-10 text-muted-foreground">جاري تحميل لوحة التحكم...</div> : <>{
    /* Stats Cards */
  }<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{dashboardStats.map((stat, i) => <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.08 }}
    className="elevated-card rounded-2xl p-5 border"
  ><div className="flex items-center justify-between mb-3"><stat.icon className={`w-6 h-6 ${stat.color}`} /></div><p className="text-2xl font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground mt-1">{stat.label}</p></motion.div>)}</div>{
    /* Users List Section */
  }<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="elevated-card rounded-2xl p-5 border space-y-4"
  ><h2 className="font-display font-bold text-foreground flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> إدارة مستخدمي المنصة ({usersList.length})
            </h2><div className="overflow-x-auto"><table className="w-full text-right border-collapse"><thead><tr className="border-b border-border/80 text-sm text-muted-foreground"><th className="pb-3 pr-2 font-semibold">الاسم</th><th className="pb-3 font-semibold">البريد الإلكتروني</th><th className="pb-3 font-semibold">الدور</th><th className="pb-3 font-semibold">الصف الدراسي</th><th className="pb-3 font-semibold">النقاط</th><th className="pb-3 pl-2 font-semibold text-center">حذف</th></tr></thead><tbody className="divide-y divide-border/40 text-sm text-foreground">{usersList.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">لا يوجد مستخدمون مسجلون.</td></tr> : usersList.map((usr) => <tr key={usr.id} className="hover:bg-secondary/35 transition-colors"><td className="py-3.5 pr-2 font-semibold">{usr.name}</td><td className="py-3.5 text-muted-foreground">{usr.email}</td><td className="py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${usr.role === "admin" ? "bg-red-500/10 text-red-500" : usr.role === "teacher" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"}`}>{getRoleLabel(usr.role)}</span></td><td className="py-3.5">{getGradeLabel(usr.grade)}</td><td className="py-3.5 font-bold">{usr.points || 0}</td><td className="py-3.5 pl-2 text-center"><button
    onClick={() => handleDeleteUser(usr.id)}
    className="text-destructive hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
    title="حذف المستخدم"
  ><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table></div></motion.div></>}</div>;
};
var AdminDashboard_default = AdminDashboard;
export {
  AdminDashboard_default as default
};
