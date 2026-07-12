import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Medal, Award, Crown, School, Users, GraduationCap } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const rankStyles = {
  1: "gradient-accent text-accent-foreground",
  2: "bg-muted text-foreground",
  3: "bg-primary/10 text-primary"
};
const RankIcon = ({ rank }) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
  return <span className="text-sm font-bold">{rank}</span>;
};
const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [loading, setLoading] = useState(true);
  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      if (activeTab === "students") {
        const res = await api.getLeaderboard(selectedGrade === "all" ? void 0 : selectedGrade);
        setStudents(res.leaderboard);
      } else {
        const res = await api.getSchools();
        setSchools(res.schools);
      }
    } catch (e) {
      toast.error(e.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u0645\u064A\u0644 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u062A\u0635\u062F\u0631\u064A\u0646");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadLeaderboard();
  }, [activeTab, selectedGrade]);
  const getTopThree = () => {
    if (activeTab === "students") {
      return students.slice(0, 3);
    }
    return [];
  };
  const getRemaining = () => {
    if (activeTab === "students") {
      return students.slice(3);
    }
    return schools;
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
  const topThree = getTopThree();
  const remaining = getRemaining();
  return <div className="max-w-3xl mx-auto space-y-6"><div><h1 className="text-2xl font-display font-bold text-foreground">لوحة المتصدرين</h1><p className="text-muted-foreground mt-1">تحدّ وتصدّر الترتيب العام على مستوى المدارس والطلاب</p></div><div className="flex gap-4 items-center justify-between"><div className="flex bg-secondary rounded-xl p-1"><button
    onClick={() => setActiveTab("students")}
    className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "students" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
  ><GraduationCap className="w-4 h-4" /> الطلاب
          </button><button
    onClick={() => setActiveTab("schools")}
    className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "schools" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
  ><School className="w-4 h-4" /> المدارس
          </button></div>{activeTab === "students" && <div className="w-48"><Select value={selectedGrade} onValueChange={setSelectedGrade}><SelectTrigger className="rounded-xl bg-secondary/50 border-border/50"><SelectValue placeholder="اختر الصف" /></SelectTrigger><SelectContent><SelectItem value="all">جميع الصفوف</SelectItem><SelectItem value="الصف الأول الثانوي">الأول الثانوي</SelectItem><SelectItem value="الصف الثاني الثانوي">الثاني الثانوي</SelectItem><SelectItem value="الصف الثالث الثانوي">الثالث الثانوي</SelectItem></SelectContent></Select></div>}</div>{loading ? <div className="text-center py-10 text-muted-foreground">جاري تحميل المتصدرين...</div> : <>{
    /* Top 3 Podiums for Students View */
  }{activeTab === "students" && topThree.length > 0 && <div className="grid grid-cols-3 gap-3 items-end pt-6">{
    /* Second Place */
  }{topThree[1] && <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  ><div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-2 bg-muted text-foreground">{topThree[1].name.charAt(0)}</div><p className="text-sm font-semibold text-foreground truncate">{topThree[1].name}</p><p className="text-xs text-muted-foreground">{topThree[1].points} نقطة</p><div className="h-28 mt-3 rounded-t-2xl flex items-center justify-center gradient-primary"><div className="text-center"><RankIcon rank={2} /><p className="text-xs font-bold text-primary-foreground mt-1">#2</p></div></div></motion.div>}{
    /* First Place */
  }{topThree[0] && <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  ><div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-2 gradient-accent text-accent-foreground">{topThree[0].name.charAt(0)}</div><p className="text-base font-bold text-foreground truncate">{topThree[0].name}</p><p className="text-xs text-muted-foreground font-semibold">{topThree[0].points} نقطة</p><div className="h-36 mt-3 rounded-t-2xl flex items-center justify-center gradient-accent"><div className="text-center"><RankIcon rank={1} /><p className="text-xs font-bold text-accent-foreground mt-1">#1</p></div></div></motion.div>}{
    /* Third Place */
  }{topThree[2] && <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  ><div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-2 bg-primary/10 text-primary">{topThree[2].name.charAt(0)}</div><p className="text-sm font-semibold text-foreground truncate">{topThree[2].name}</p><p className="text-xs text-muted-foreground">{topThree[2].points} نقطة</p><div className="h-24 mt-3 rounded-t-2xl flex items-center justify-center bg-primary/70"><div className="text-center"><RankIcon rank={3} /><p className="text-xs font-bold text-primary-foreground mt-1">#3</p></div></div></motion.div>}</div>}{
    /* Leaderboard list */
  }<div className="elevated-card rounded-2xl overflow-hidden">{remaining.length === 0 ? <div className="text-center py-10 text-muted-foreground bg-secondary/10">لا يوجد متصدرين في القائمة حالياً.</div> : remaining.map((item, i) => {
    const rank = activeTab === "students" ? i + 4 : i + 1;
    return <motion.div
      key={item.id || item.school_code}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(i * 0.05, 0.4) }}
      className={`flex items-center gap-4 px-5 py-4 ${i < remaining.length - 1 ? "border-b border-border/50" : ""}`}
    ><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${rankStyles[rank] || "bg-secondary text-foreground"}`}><RankIcon rank={rank} /></div><div className="flex-1 min-w-0">{activeTab === "students" ? <><p className="font-semibold text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{getGradeLabel(item.grade) || item.grade}</p></> : <><p className="font-semibold text-foreground flex items-center gap-1.5"><School className="w-4 h-4 text-primary shrink-0" />
                            كود المدرسة: {item.school_code}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {item.students} طالب مسجل
                          </p></>}</div><div className="flex items-center gap-4 text-sm font-semibold">{activeTab === "students" && item.badges?.length > 0 && <span className="flex items-center gap-1 text-accent text-xs bg-accent/10 px-2 py-0.5 rounded-full"><Medal className="w-3.5 h-3.5 text-accent" /> {item.badges.length} شارات
                        </span>}<span className="font-bold text-foreground w-20 text-left">{activeTab === "students" ? item.points : item.total_points} نقطة
                      </span></div></motion.div>;
  })}</div></>}</div>;
};
var Leaderboard_default = Leaderboard;
export {
  Leaderboard_default as default
};
