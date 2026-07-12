import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, CheckCircle, ChevronLeft, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
const subjectColors = {
  "\u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0621": "bg-blue-500/10 text-blue-500",
  "\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629": "bg-emerald-500/10 text-emerald-500",
  "\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A": "bg-violet-500/10 text-violet-500",
  "\u0627\u0644\u0623\u062D\u064A\u0627\u0621": "bg-rose-500/10 text-rose-500"
};
const Challenges = () => {
  const { user, refreshUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadData = async () => {
    try {
      const chRes = await api.getChallenges();
      let subRes = { submissions: [] };
      if (user) {
        subRes = await api.getSubmissions();
      }
      setChallenges(chRes.challenges);
      setSubmissions(subRes.submissions);
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [user]);
  const handleSubmitAnswer = async () => {
    if (!selectedChallenge) return;
    if (!answerText.trim()) {
      toast.error("\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0623\u0648\u0644\u0627\u064B");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.submitChallenge(selectedChallenge.id, answerText);
      toast.success("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u062C\u0627\u0628\u062A\u0643 \u0628\u0646\u062C\u0627\u062D! \u0644\u0642\u062F \u062D\u0635\u0644\u062A \u0639\u0644\u0649 \u0627\u0644\u0646\u0642\u0627\u0637.");
      setSelectedChallenge(null);
      setAnswerText("");
      await refreshUser();
      await loadData();
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u062C\u0627\u0628\u0629");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isChallengeCompleted = (challengeId) => {
    return submissions.some((s) => s.challengeId === challengeId);
  };
  const completedCount = submissions.length;
  const activeCount = challenges.filter((c) => !isChallengeCompleted(c.id)).length;
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-EG", { day: "numeric", month: "long" });
  };
  return <div className="max-w-3xl mx-auto space-y-6"><div><h1 className="text-2xl font-display font-bold text-foreground">التحديات الأسبوعية</h1><p className="text-muted-foreground mt-1">أكمل التحديات المدرسية لكسب النقاط والشارات</p></div><div className="grid grid-cols-3 gap-4">{[
    { label: "\u0645\u0643\u062A\u0645\u0644\u0629", value: String(completedCount), icon: CheckCircle, color: "text-emerald-500" },
    { label: "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630", value: String(activeCount), icon: Clock, color: "text-amber-500" },
    { label: "\u0646\u0642\u0627\u0637\u0643 \u0627\u0644\u062D\u0627\u0644\u064A\u0629", value: String(user?.points || 0), icon: Trophy, color: "text-primary" }
  ].map((stat) => <div key={stat.label} className="elevated-card rounded-2xl p-4 text-center"><stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} /><p className="text-2xl font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>)}</div>{loading ? <div className="text-center py-10 text-muted-foreground">جاري تحميل التحديات...</div> : challenges.length === 0 ? <div className="text-center py-10 text-muted-foreground bg-secondary/20 rounded-2xl">
          لا توجد تحديات نشطة حالياً.
        </div> : challenges.map((ch, i) => {
    const completed = isChallengeCompleted(ch.id);
    const deadlineText = `\u064A\u0646\u062A\u0647\u064A \u0641\u064A ${formatDate(ch.end_date)}`;
    return <motion.div
      key={ch.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      className="elevated-card rounded-2xl p-5"
    ><div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${subjectColors[ch.subject] || "bg-secondary text-foreground"}`}>{ch.subject}</span><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${completed ? "bg-emerald-500/10 text-emerald-500" : "bg-accent/20 text-accent-foreground"}`}>{completed ? "\u0645\u0643\u062A\u0645\u0644" : deadlineText}</span></div><h3 className="text-lg font-semibold text-foreground">{ch.title}</h3><p className="text-sm text-muted-foreground mt-1 leading-relaxed">{ch.description}</p><div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-medium"><span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-primary" />{ch.points} نقطة</span><span className="text-xs">المرحلة: {ch.grade}</span></div></div>{completed ? <Button
      variant="outline"
      size="sm"
      className="shrink-0 rounded-xl gap-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
      disabled
    >
                    تم الحل <CheckCircle className="w-4 h-4" /></Button> : <Button
      variant="default"
      size="sm"
      onClick={() => {
        if (!user) {
          toast.error("\u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0628\u062F\u0621 \u0627\u0644\u062A\u062D\u062F\u064A");
          return;
        }
        setSelectedChallenge(ch);
      }}
      className="shrink-0 rounded-xl gap-1 gradient-primary text-primary-foreground"
    >
                    ابدأ <ChevronLeft className="w-4 h-4" /></Button>}</div></motion.div>;
  })}{
    /* Solving Overlay Modal */
  }{selectedChallenge && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
  ><motion.div
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
    className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-2xl space-y-4"
  ><div className="flex justify-between items-center"><h3 className="text-lg font-bold text-foreground">حل التحدي</h3><button
    onClick={() => setSelectedChallenge(null)}
    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
  ><X className="w-4 h-4" /></button></div><div><span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{selectedChallenge.subject}</span><h4 className="font-semibold text-foreground mt-2">{selectedChallenge.title}</h4><p className="text-sm text-muted-foreground mt-1 leading-relaxed">{selectedChallenge.description}</p></div><div className="space-y-1.5"><label className="text-sm font-medium text-foreground">إجابتك</label><textarea
    value={answerText}
    onChange={(e) => setAnswerText(e.target.value)}
    placeholder="اكتب إجابتك بالتفصيل هنا..."
    rows={4}
    className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-primary/50"
  /></div><Button
    className="w-full gradient-primary text-primary-foreground rounded-xl py-5 text-base gap-2"
    disabled={isSubmitting}
    onClick={handleSubmitAnswer}
  >{isSubmitting ? "\u062C\u0627\u0631\u064A \u0627\u0644\u0625\u0631\u0633\u0627\u0644..." : "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062D\u0644"} <Send className="w-4 h-4" /></Button></motion.div></motion.div>}</div>;
};
var Challenges_default = Challenges;
export {
  Challenges_default as default
};
