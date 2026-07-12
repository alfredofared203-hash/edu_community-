import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  BookOpen,
  Target,
  Star,
  Calendar,
  CheckCircle,
  Beaker,
  PenTool,
  ShieldAlert,
  GraduationCap,
  School
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { toast } from "sonner";
const defaultBadges = [
  { name: "\u0628\u0637\u0644 \u0627\u0644\u0623\u0633\u0628\u0648\u0639", icon: Trophy },
  { name: "\u0645\u0634\u0627\u0631\u0643 \u0646\u0634\u0637", icon: Award },
  { name: "\u0635\u062F\u064A\u0642 \u0627\u0644\u0645\u062C\u062A\u0645\u0639", icon: Star },
  { name: "\u0645\u062D\u0628 \u0627\u0644\u0639\u0644\u0645", icon: Beaker },
  { name: "\u0623\u0648\u0644 \u0645\u0646\u0634\u0648\u0631", icon: PenTool }
];
const Profile = () => {
  const { user } = useAuth();
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadProfileData = async () => {
    if (!user) return;
    try {
      const [challengesRes, subsRes] = await Promise.all([
        api.getChallenges(),
        api.getSubmissions()
      ]);
      const chMap = new Map(challengesRes.challenges.map((c) => [c.id, c]));
      const mapped = subsRes.submissions.map((sub) => {
        const ch = chMap.get(sub.challengeId);
        return {
          title: ch ? ch.title : "\u062A\u062D\u062F\u064A \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641",
          points: ch ? ch.points : 0,
          date: new Date(sub.submittedAt).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })
        };
      });
      setCompletedChallenges(mapped);
    } catch (e) {
      toast.error(e.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProfileData();
  }, [user]);
  const getRoleLabel = (role) => {
    switch (role) {
      case "student":
        return "\u0637\u0627\u0644\u0628";
      case "teacher":
        return "\u0645\u0639\u0644\u0645";
      case "admin":
        return "\u0645\u062F\u064A\u0631 \u0645\u062F\u0631\u0633\u0629";
      case "supervisor":
        return "\u0645\u0634\u0631\u0641 \u062A\u0639\u0644\u064A\u0645\u064A";
      default:
        return "";
    }
  };
  const getGradeLabel = (grade) => {
    if (!grade) return "";
    switch (grade) {
      case "primary-1":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u0623\u0648\u0644 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-2":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0646\u064A \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-3":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0644\u062B \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-4":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u0631\u0627\u0628\u0639 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-5":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u062E\u0627\u0645\u0633 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "primary-6":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u0633\u0627\u062F\u0633 \u0627\u0644\u0627\u0628\u062A\u062F\u0627\u0626\u064A";
      case "prep-1":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u0623\u0648\u0644 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u064A";
      case "prep-2":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0646\u064A \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u064A";
      case "prep-3":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0644\u062B \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u064A";
      case "sec-1":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u0623\u0648\u0644 \u0627\u0644\u062B\u0627\u0646\u0648\u064A";
      case "sec-2":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0646\u064A \u0627\u0644\u062B\u0627\u0646\u0648\u064A";
      case "sec-3":
        return "\u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0644\u062B \u0627\u0644\u062B\u0627\u0646\u0648\u064A";
      default:
        return grade;
    }
  };
  if (!user) {
    return <div className="max-w-md mx-auto text-center py-12 space-y-4 elevated-card rounded-2xl p-6 bg-card border"><ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" /><h2 className="text-xl font-bold text-foreground">الرجاء تسجيل الدخول</h2><p className="text-sm text-muted-foreground">الملف الشخصي متوفر للأعضاء المسجلين فقط.</p></div>;
  }
  const points = user.points || 0;
  const skills = [
    { name: "\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A", level: Math.min(Math.floor(points / 15), 100) },
    { name: "\u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0621", level: Math.min(Math.floor(points / 20), 100) },
    { name: "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629", level: Math.min(Math.floor(points / 12), 100) },
    { name: "\u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0621", level: Math.min(Math.floor(points / 18), 100) }
  ];
  return <div className="max-w-3xl mx-auto space-y-6"><motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="elevated-card rounded-2xl overflow-hidden border"
  ><div className="h-28 gradient-hero" /><div className="px-6 pb-6 -mt-10"><div className="flex items-end gap-4 flex-wrap sm:flex-nowrap"><div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center text-2xl font-bold text-accent-foreground border-4 border-card shadow-lg shrink-0">{user.name.charAt(0)}</div><div className="flex-1 pt-12 min-w-0"><h1 className="text-xl font-display font-bold text-foreground truncate">{user.name}</h1><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">{user.grade && <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-primary" /> {getGradeLabel(user.grade)}</span>}<span className="flex items-center gap-1"><School className="w-4 h-4 text-primary" /> {user.schoolCode ? `\u0645\u062F\u0631\u0633\u0629: ${user.schoolCode}` : "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062F\u0631\u0633\u0629 \u0645\u0636\u0627\u0641\u0629"}</span><span className="bg-secondary px-2.5 py-0.5 rounded-full text-xs font-semibold">{getRoleLabel(user.role)}</span></div></div><div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-semibold mt-4 sm:mt-0 shrink-0"><Trophy className="w-4 h-4 text-accent" /> {user.points || 0} نقطة
            </div></div></div></motion.div><div className="grid md:grid-cols-2 gap-6">{
    /* Skills block */
  }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="elevated-card rounded-2xl p-5 border"><h2 className="font-display font-bold text-foreground flex items-center gap-2 mb-4"><Target className="w-5 h-5 text-primary" /> المهارات التراكمية
          </h2><div className="space-y-3">{skills.map((skill) => <div key={skill.name}><div className="flex justify-between text-sm mb-1"><span className="text-foreground font-medium">{skill.name}</span><span className="text-muted-foreground">{skill.level}%</span></div><Progress value={skill.level} className="h-2" /></div>)}</div></motion.div>{
    /* Badges block */
  }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="elevated-card rounded-2xl p-5 border"><h2 className="font-display font-bold text-foreground flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-accent" /> شارات التكريم
          </h2><div className="grid grid-cols-3 gap-3">{defaultBadges.map((badge) => {
    const earned = user.badges?.includes(badge.name);
    return <div
      key={badge.name}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all ${earned ? "bg-accent/10 border border-accent/20 scale-105" : "bg-muted/50 opacity-40"}`}
    ><badge.icon className={`w-7 h-7 ${earned ? "text-accent" : "text-muted-foreground"}`} /><span className="text-xs font-medium text-foreground">{badge.name}</span></div>;
  })}</div></motion.div></div>{
    /* Completed challenges block */
  }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="elevated-card rounded-2xl p-5 border"><h2 className="font-display font-bold text-foreground flex items-center gap-2 mb-4"><CheckCircle className="w-5 h-5 text-emerald-500" /> التحديات المكتملة
        </h2>{loading ? <div className="text-sm text-muted-foreground">جاري تحميل التحديات المكتملة...</div> : completedChallenges.length === 0 ? <div className="text-sm text-muted-foreground bg-secondary/20 p-4 rounded-xl text-center">لم تقم بحل أي تحديات بعد. انطلق إلى صفحة التحديات وابدأ المنافسة!</div> : <div className="space-y-3">{completedChallenges.map((ch, idx) => <div key={idx} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"><BookOpen className="w-5 h-5 text-primary shrink-0" /><div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground">{ch.title}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> تم الحل في: {ch.date}</p></div><span className="text-sm font-bold text-accent">+{ch.points} نقطة</span></div>)}</div>}</motion.div></div>;
};
var Profile_default = Profile;
export {
  Profile_default as default
};
