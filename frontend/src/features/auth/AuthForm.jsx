import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { GRADES } from "../../lib/grades";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// فورم بسيط للدخول والتسجيل باستخدام useState
function AuthForm() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true); // بنبدّل بين الدخول والتسجيل
  const [loading, setLoading] = useState(false);

  // كل حقل في الفورم له متغير
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [grade, setGrade] = useState("sec-1");
  const [schoolCode, setSchoolCode] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // تحقّق بسيط قبل الإرسال
    if (!email || !password) {
      toast.error("اكتب البريد وكلمة المرور");
      return;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور 6 أحرف على الأقل");
      return;
    }
    if (!isLogin && !name) {
      toast.error("اكتب الاسم");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login({ email, password });
        toast.success("تم تسجيل الدخول");
      } else {
        await register({
          name,
          email,
          password,
          role,
          grade: role === "student" ? grade : undefined,
          schoolCode: schoolCode || undefined,
        });
        toast.success("تم إنشاء الحساب");
      }
      navigate("/materials");
    } catch (err) {
      toast.error(err.message || "فشلت العملية");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-card rounded-2xl p-6 lg:p-8 shadow-xl border border-border">
      <h2 className="text-2xl font-display font-bold text-foreground mb-1">
        {isLogin ? "تسجيل الدخول" : "حساب جديد"}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {isLogin ? "أهلاً بك مرة أخرى!" : "انضم لمجتمع التعليم المصري."}
      </p>

      {/* أزرار التبديل بين الدخول والتسجيل */}
      <div className="flex bg-secondary rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg ${isLogin ? "bg-card shadow-sm" : "text-muted-foreground"}`}
        >
          تسجيل الدخول
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg ${!isLogin ? "bg-card shadow-sm" : "text-muted-foreground"}`}
        >
          حساب جديد
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-1.5">
            <Label>الاسم الكامل</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="محمد أحمد" className="rounded-xl" />
          </div>
        )}

        <div className="space-y-1.5">
          <Label>البريد الإلكتروني</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <Label>كلمة المرور</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="rounded-xl" />
        </div>

        {!isLogin && (
          <>
            <div className="space-y-1.5">
              <Label>نوع الحساب</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">طالب</SelectItem>
                  <SelectItem value="teacher">معلم</SelectItem>
                  <SelectItem value="admin">مدير مدرسة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "student" && (
              <div className="space-y-1.5">
                <Label>المرحلة الدراسية</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>كود المدرسة (اختياري)</Label>
              <Input value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} placeholder="SCH-2024" className="rounded-xl" />
            </div>
          </>
        )}

        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground rounded-xl py-5 text-base">
          {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
        </Button>
      </form>
    </div>
  );
}

export default AuthForm;
