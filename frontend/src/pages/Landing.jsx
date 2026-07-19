import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  GraduationCap,
  ArrowLeft,
  BookOpen,
  Trophy,
  Users,
  Star,
  BarChart3,
  MessageSquare,
  Shield,
  ChevronLeft,
  Sparkles,
  Target,
  Award,
  Zap,
  User,
  Lock,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { GRADES } from "../lib/grades";
const features = [
  { icon: BookOpen, title: "\u0634\u0627\u0631\u0643 \u0627\u0644\u0645\u0639\u0631\u0641\u0629", desc: "\u0627\u0646\u0634\u0631 \u0627\u0644\u0645\u0644\u062E\u0635\u0627\u062A \u0648\u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0648\u0627\u0644\u0645\u0648\u0627\u0631\u062F" },
  { icon: Trophy, title: "\u0627\u0643\u0633\u0628 \u0627\u0644\u0634\u0627\u0631\u0627\u062A", desc: "\u0623\u0643\u0645\u0644 \u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A \u0648\u062A\u0635\u062F\u0651\u0631 \u0627\u0644\u062A\u0631\u062A\u064A\u0628" },
  { icon: Users, title: "\u0645\u062C\u062A\u0645\u0639 \u062A\u0639\u0644\u064A\u0645\u064A", desc: "\u0627\u0646\u0636\u0645 \u0644\u0645\u062C\u062A\u0645\u0639 \u0635\u0641\u0643 \u0627\u0644\u062F\u0631\u0627\u0633\u064A" },
  { icon: Star, title: "\u0642\u064A\u0651\u0645 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646", desc: "\u0634\u0627\u0631\u0643 \u0631\u0623\u064A\u0643 \u0644\u062A\u062D\u0633\u064A\u0646 \u0627\u0644\u062A\u0639\u0644\u064A\u0645" }
];
const sections = [
  {
    icon: MessageSquare,
    title: "\u0627\u0644\u0645\u062C\u062A\u0645\u0639 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A",
    desc: "\u0627\u0646\u0634\u0631 \u0648\u0634\u0627\u0631\u0643 \u0627\u0644\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A \u0645\u0639 \u0637\u0644\u0627\u0628 \u0635\u0641\u0643 \u0648\u062C\u0645\u064A\u0639 \u0623\u0646\u062D\u0627\u0621 \u0645\u0635\u0631.",
    path: "/feed",
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50"
  },
  {
    icon: Trophy,
    title: "\u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A\u0629",
    desc: "\u062A\u0646\u0627\u0641\u0633 \u0645\u0639 \u0632\u0645\u0644\u0627\u0626\u0643 \u0641\u064A \u062A\u062D\u062F\u064A\u0627\u062A \u0639\u0644\u0645\u064A\u0629 \u0648\u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629 \u0645\u062A\u062C\u062F\u062F\u0629.",
    path: "/challenges",
    color: "from-amber-500 to-orange-400",
    bg: "bg-amber-50"
  },
  {
    icon: BarChart3,
    title: "\u0627\u0644\u0645\u062A\u0635\u062F\u0631\u0648\u0646",
    desc: "\u0634\u0627\u0647\u062F \u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0639\u0627\u0645 \u0644\u0644\u0637\u0644\u0627\u0628 \u0648\u0627\u0644\u0645\u062F\u0627\u0631\u0633 \u0627\u0644\u0623\u0643\u062B\u0631 \u0646\u0634\u0627\u0637\u0627\u064B.",
    path: "/leaderboard",
    color: "from-emerald-500 to-green-400",
    bg: "bg-emerald-50"
  },
  {
    icon: Star,
    title: "\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646",
    desc: "\u0642\u064A\u0651\u0645 \u0645\u0639\u0644\u0645\u064A\u0643 \u0648\u0634\u0627\u0631\u0643 \u0627\u0644\u062A\u062C\u0627\u0631\u0628 \u0644\u0628\u0646\u0627\u0621 \u0628\u064A\u0626\u0629 \u062A\u0639\u0644\u064A\u0645\u064A\u0629 \u0623\u0641\u0636\u0644.",
    path: "/teachers",
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-50"
  },
  {
    icon: User,
    title: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A",
    desc: "\u062A\u062A\u0628\u0639 \u062A\u0642\u062F\u0645\u0643\u060C \u0634\u0627\u0631\u0627\u062A\u0643\u060C \u0648\u0625\u0646\u062C\u0627\u0632\u0627\u062A\u0643 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629.",
    path: "/profile",
    color: "from-rose-500 to-pink-400",
    bg: "bg-rose-50"
  },
  {
    icon: Shield,
    title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645",
    desc: "\u0644\u0648\u062D\u0629 \u0625\u062F\u0627\u0631\u064A\u0629 \u0644\u0645\u062F\u064A\u0631\u064A \u0627\u0644\u0645\u062F\u0627\u0631\u0633 \u0648\u0627\u0644\u0645\u0634\u0631\u0641\u064A\u0646 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A\u064A\u0646.",
    path: "/admin",
    color: "from-slate-600 to-slate-400",
    bg: "bg-slate-50"
  }
];
const stats = [
  { icon: Users, value: "+\u0661\u0660\u0660 \u0623\u0644\u0641", label: "\u0637\u0627\u0644\u0628 \u0645\u0633\u062C\u0644" },
  { icon: Award, value: "+\u0665\u0660\u0660\u0660", label: "\u0634\u0627\u0631\u0629 \u0645\u0646\u062D\u062A" },
  { icon: Target, value: "+\u0662\u0660\u0660\u0660", label: "\u062A\u062D\u062F\u064A \u0645\u0643\u062A\u0645\u0644" },
  { icon: Sparkles, value: "\u0669\u0668\u066A", label: "\u0631\u0636\u0627 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646" }
];
const Landing = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [role, setRole] = useState("student");
  const [grade, setGrade] = useState("sec-1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login({ email, password });
        toast.success("\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0646\u062C\u0627\u062D");
        setShowAuth(false);
        navigate("/feed");
      } else {
        if (!fullName || !role) {
          toast.error("\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629");
          setIsSubmitting(false);
          return;
        }
        await register({
          name: fullName,
          email,
          password,
          role,
          grade: role === "student" ? grade : void 0,
          schoolCode: schoolCode || void 0,
          nationalId: nationalId || void 0
        });
        toast.success("\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0646\u062C\u0627\u062D");
        setShowAuth(false);
        navigate("/feed");
      }
    } catch (error) {
      toast.error(error.message || "\u0641\u0634\u0644\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen flex flex-col bg-background">{
    /* Navbar */
  }<nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b"><div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center"><GraduationCap className="w-6 h-6 text-accent-foreground" /></div><div><span className="text-lg font-display font-bold text-foreground">مجتمع مصر التعليمي</span><span className="hidden sm:inline text-xs text-muted-foreground mr-2">🇪🇬</span></div></div><Button
    onClick={() => setShowAuth(true)}
    className="gradient-primary text-primary-foreground rounded-xl gap-2"
  ><Lock className="w-4 h-4" />
            تسجيل الدخول
          </Button></div></nav>{
    /* Hero */
  }<div className="gradient-hero text-primary-foreground pt-24"><div className="max-w-6xl mx-auto px-4 py-16 lg:py-24"><div className="grid lg:grid-cols-2 gap-12 items-center"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-sm font-medium mb-6"><Sparkles className="w-4 h-4" />
                المنصة التعليمية الوطنية الأولى
              </div><h1 className="text-4xl lg:text-5xl font-display font-extrabold leading-tight mb-4">
                المجتمع التعليمي الوطني لمصر 🇪🇬
              </h1><p className="text-lg text-primary-foreground/80 mb-8 max-w-md">
                تواصل مع طلاب من جميع أنحاء مصر. شارك المعرفة، تنافس في التحديات،
                وابنِ ملفك الأكاديمي.
              </p><div className="flex flex-wrap gap-3"><Button
    onClick={() => setShowAuth(true)}
    className="bg-primary-foreground text-primary rounded-xl px-6 py-5 text-base font-semibold gap-2 hover:bg-primary-foreground/90"
  >
                  ابدأ رحلتك <ArrowLeft className="w-4 h-4" /></Button><Button
    variant="outline"
    onClick={() => navigate("/feed")}
    className="rounded-xl px-6 py-5 text-base font-semibold gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
  >
                  تصفح المجتمع <ChevronLeft className="w-4 h-4" /></Button></div><div className="grid grid-cols-2 gap-4 mt-10">{features.map((f, i) => <motion.div
    key={f.title}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + i * 0.1 }}
    className="flex items-start gap-3 p-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm"
  ><f.icon className="w-5 h-5 mt-0.5 text-accent shrink-0" /><div><p className="text-sm font-semibold">{f.title}</p><p className="text-xs text-primary-foreground/60">{f.desc}</p></div></motion.div>)}</div></motion.div>{
    /* Hero Image / Illustration */
  }<motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    className="hidden lg:flex items-center justify-center"
  ><div className="relative w-full max-w-md aspect-square"><div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl rotate-3" /><div className="absolute inset-0 bg-card rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border border-border"><div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mb-6"><GraduationCap className="w-10 h-10 text-accent-foreground" /></div><h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    انضم الآن مجاناً
                  </h3><p className="text-muted-foreground text-center mb-6">
                    فتح حساب يستغرق أقل من دقيقة واحدة. انضم لأكثر من ١٠٠ ألف طالب ومعلم.
                  </p><div className="flex -space-x-3 space-x-reverse">{["\u0623", "\u0645", "\u0639", "\u0641"].map((l, i) => <div
    key={i}
    className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground border-2 border-card"
    style={{ marginRight: i > 0 ? "-0.75rem" : 0 }}
  >{l}</div>)}</div></div></div></motion.div></div></div></div>{
    /* Stats */
  }<div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10"><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{stats.map((s, i) => <motion.div
    key={s.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + i * 0.1 }}
    className="glass-card rounded-2xl p-5 text-center"
  ><s.icon className="w-8 h-8 mx-auto mb-3 text-primary" /><p className="text-2xl font-display font-bold text-foreground">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p></motion.div>)}</div></div>{
    /* Sections Grid */
  }<div className="max-w-6xl mx-auto px-4 py-16"><div className="text-center mb-12"><h2 className="text-3xl font-display font-bold text-foreground mb-3">
            اكتشف أقسام المنصة
          </h2><p className="text-muted-foreground max-w-lg mx-auto">
            كل قسم مصمم لخدمة جانب من جوانب حياتك الأكاديمية والتفاعلية مع زملائك.
          </p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{sections.map((section, i) => <motion.div
    key={section.path}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * i }}
    onClick={() => navigate(section.path)}
    className="group cursor-pointer"
  ><div className="glass-card rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30"><div
    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}
  ><section.icon className="w-7 h-7 text-white" /></div><h3 className="text-xl font-display font-bold text-foreground mb-2">{section.title}</h3><p className="text-muted-foreground text-sm leading-relaxed mb-4">{section.desc}</p><div className="flex items-center gap-2 text-primary font-medium text-sm"><span>استكشف القسم</span><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /></div></div></motion.div>)}</div></div>{
    /* How it works */
  }<div className="bg-secondary/30 py-16"><div className="max-w-6xl mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl font-display font-bold text-foreground mb-3">
              كيف تعمل المنصة؟
            </h2><p className="text-muted-foreground max-w-lg mx-auto">
              ثلاث خطوات بسيطة تفصلك عن الانضمام لمجتمعنا التعليمي.
            </p></div><div className="grid md:grid-cols-3 gap-8">{[
    {
      icon: User,
      step: "\u0660\u0661",
      title: "\u0623\u0646\u0634\u0626 \u062D\u0633\u0627\u0628\u0643",
      desc: "\u0633\u062C\u0651\u0644 \u0643\u0637\u0627\u0644\u0628 \u0623\u0648 \u0645\u0639\u0644\u0645 \u0623\u0648 \u0645\u062F\u064A\u0631 \u0645\u062F\u0631\u0633\u0629 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0643\u0648\u062F \u0627\u0644\u0645\u062F\u0631\u0633\u0629."
    },
    {
      icon: Zap,
      step: "\u0660\u0662",
      title: "\u0627\u0646\u0636\u0645 \u0644\u0645\u062C\u062A\u0645\u0639\u0643",
      desc: "\u0627\u062E\u062A\u0631 \u0635\u0641\u0643 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0648\u062A\u0641\u0627\u0639\u0644 \u0645\u0639 \u0632\u0645\u0644\u0627\u0626\u0643 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u0645\u0631\u062D\u0644\u0629."
    },
    {
      icon: Award,
      step: "\u0660\u0663",
      title: "\u0627\u0643\u0633\u0628 \u0648\u0627\u0628\u062F\u0639",
      desc: "\u0634\u0627\u0631\u0643 \u0645\u062D\u062A\u0648\u0627\u0643\u060C \u0623\u0643\u0645\u0644 \u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A\u060C \u0648\u0627\u0631\u062A\u0642\u0650 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u062A\u0635\u062F\u0631\u064A\u0646."
    }
  ].map((item, i) => <motion.div
    key={item.title}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + i * 0.1 }}
    className="text-center"
  ><div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-lg"><item.icon className="w-8 h-8 text-primary-foreground" /></div><span className="text-4xl font-display font-bold text-primary/20 block mb-2">{item.step}</span><h3 className="text-xl font-display font-bold text-foreground mb-2">{item.title}</h3><p className="text-muted-foreground text-sm max-w-xs mx-auto">{item.desc}</p></motion.div>)}</div></div></div>{
    /* CTA */
  }<div className="max-w-6xl mx-auto px-4 py-16"><div className="gradient-hero rounded-3xl p-8 lg:p-12 text-center text-primary-foreground"><h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            جاهز للانضمام لمجتمعنا؟
          </h2><p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            انضم لأكثر من ١٠٠ ألف طالب ومعلم مصري. شارك المعرفة، تنافس، وابنِ مستقبلك.
          </p><div className="flex flex-wrap justify-center gap-4"><Button
    onClick={() => setShowAuth(true)}
    className="bg-primary-foreground text-primary rounded-xl px-8 py-5 text-base font-semibold gap-2 hover:bg-primary-foreground/90"
  >
              سجّل الآن مجاناً <ArrowLeft className="w-4 h-4" /></Button><Button
    variant="outline"
    onClick={() => navigate("/feed")}
    className="rounded-xl px-8 py-5 text-base font-semibold gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
  >
              تصفح بدون تسجيل <ChevronLeft className="w-4 h-4" /></Button></div></div></div>{
    /* Footer */
  }<footer className="bg-card border-t border-border py-10 mt-auto"><div className="max-w-6xl mx-auto px-4"><div className="grid md:grid-cols-4 gap-8 mb-8"><div><div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center"><GraduationCap className="w-4 h-4 text-accent-foreground" /></div><span className="font-display font-bold text-foreground">مجتمع مصر التعليمي</span></div><p className="text-sm text-muted-foreground">
                المنصة التعليمية الوطنية التي تربط طلاب مصر ببعضهم البعض وبالمعلمين.
              </p></div><div><h4 className="font-semibold text-foreground mb-3">الأقسام</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><button onClick={() => navigate("/feed")} className="hover:text-primary transition-colors">المجتمع</button></li><li><button onClick={() => navigate("/challenges")} className="hover:text-primary transition-colors">التحديات</button></li><li><button onClick={() => navigate("/leaderboard")} className="hover:text-primary transition-colors">المتصدرون</button></li><li><button onClick={() => navigate("/teachers")} className="hover:text-primary transition-colors">تقييم المعلمين</button></li></ul></div><div><h4 className="font-semibold text-foreground mb-3">الحساب</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><button onClick={() => setShowAuth(true)} className="hover:text-primary transition-colors">تسجيل الدخول</button></li><li><button onClick={() => navigate("/profile")} className="hover:text-primary transition-colors">الملف الشخصي</button></li><li><button onClick={() => navigate("/admin")} className="hover:text-primary transition-colors">لوحة التحكم</button></li></ul></div><div><h4 className="font-semibold text-foreground mb-3">تواصل معنا</h4><ul className="space-y-2 text-sm text-muted-foreground"><li>support@educommunity.eg</li><li>القاهرة، جمهورية مصر العربية</li><li>© ٢٠٢٦ وزارة التربية والتعليم</li></ul></div></div><div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © ٢٠٢٦ مجتمع مصر التعليمي — مبادرة وزارة التربية والتعليم
          </div></div></footer>{
    /* Auth Modal */
  }{showAuth && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={() => setShowAuth(false)}
  ><motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    onClick={(e) => e.stopPropagation()}
    className="bg-card rounded-2xl p-6 lg:p-8 w-full max-w-md shadow-2xl border border-border"
  ><div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-display font-bold text-foreground">{isLogin ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" : "\u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F"}</h2><p className="text-sm text-muted-foreground mt-1">{isLogin ? "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649! \u0633\u062C\u0651\u0644 \u062F\u062E\u0648\u0644\u0643 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629." : "\u0623\u0646\u0634\u0626 \u062D\u0633\u0627\u0628\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B \u0648\u0627\u0646\u0636\u0645 \u0644\u0645\u062C\u062A\u0645\u0639\u0646\u0627."}</p></div><button
    onClick={() => setShowAuth(false)}
    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
  >
                ✕
              </button></div><div className="flex bg-secondary rounded-xl p-1 mb-6"><button
    onClick={() => setIsLogin(true)}
    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
  >
                تسجيل الدخول
              </button><button
    onClick={() => setIsLogin(false)}
    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
  >
                حساب جديد
              </button></div><div className="space-y-4">{!isLogin && <><div><label className="text-sm font-medium text-foreground mb-1.5 block">الاسم الكامل</label><Input placeholder="محمد أحمد" className="rounded-xl bg-secondary/50 border-border/50" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div><div><label className="text-sm font-medium text-foreground mb-1.5 block">كود المدرسة</label><Input placeholder="مثال: SCH-2024" className="rounded-xl bg-secondary/50 border-border/50" value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} /></div><div><label className="text-sm font-medium text-foreground mb-1.5 block">الرقم القومي</label><Input placeholder="٢٨XXXXXXXXXX" className="rounded-xl bg-secondary/50 border-border/50" value={nationalId} onChange={(e) => setNationalId(e.target.value)} /></div><div><label className="text-sm font-medium text-foreground mb-1.5 block">نوع الحساب</label><Select value={role} onValueChange={setRole}><SelectTrigger className="rounded-xl bg-secondary/50 border-border/50"><SelectValue placeholder="اختر الدور" /></SelectTrigger><SelectContent className="z-[110]" dir="rtl"><SelectItem value="student">طالب</SelectItem><SelectItem value="teacher">مدرس</SelectItem></SelectContent></Select></div>{role === "student" && <div><label className="text-sm font-medium text-foreground mb-1.5 block">المرحلة الدراسية</label><Select value={grade} onValueChange={setGrade}><SelectTrigger className="rounded-xl bg-secondary/50 border-border/50"><SelectValue placeholder="اختر الصف" /></SelectTrigger><SelectContent className="z-[110]" dir="rtl">{GRADES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>}</>}<div><label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</label><div className="relative"><Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input
    placeholder="name@example.com"
    type="email"
    className="rounded-xl bg-secondary/50 border-border/50 pr-10"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  /></div></div><div><label className="text-sm font-medium text-foreground mb-1.5 block">كلمة المرور</label><div className="relative"><Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input
    placeholder="••••••••"
    type="password"
    className="rounded-xl bg-secondary/50 border-border/50 pr-10"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  /></div></div><Button
    className="w-full gradient-primary text-primary-foreground rounded-xl py-5 text-base gap-2 mt-2"
    disabled={isSubmitting}
    onClick={handleSubmit}
  >{isSubmitting ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644..." : isLogin ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" : "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628"} <ArrowLeft className="w-4 h-4" /></Button></div></motion.div></motion.div>}</div>;
};
var Landing_default = Landing;
export {
  Landing_default as default
};
