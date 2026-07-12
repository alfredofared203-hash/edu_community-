import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { GRADES } from "../../lib/grades";
import { loginSchema, registerSchema } from "./schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
const AuthForm = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
      grade: "sec-1",
      schoolCode: "",
      nationalId: ""
    }
  });
  const role = form.watch("role");
  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isLogin) {
        await login({ email: values.email, password: values.password });
        toast.success("\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0646\u062C\u0627\u062D");
      } else {
        await register({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          grade: values.role === "student" ? values.grade : void 0,
          schoolCode: values.schoolCode || void 0,
          nationalId: values.nationalId || void 0
        });
        toast.success("\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0646\u062C\u0627\u062D");
      }
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "\u0641\u0634\u0644\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629");
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="w-full max-w-md bg-card rounded-2xl p-6 lg:p-8 shadow-xl border border-border"><h2 className="text-2xl font-display font-bold text-foreground mb-1">{isLogin ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" : "\u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F"}</h2><p className="text-sm text-muted-foreground mb-6">{isLogin ? "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649!" : "\u0627\u0646\u0636\u0645 \u0644\u0645\u062C\u062A\u0645\u0639 \u0627\u0644\u062A\u0639\u0644\u064A\u0645 \u0627\u0644\u0645\u0635\u0631\u064A."}</p>{
    /* تبديل بين الدخول والتسجيل */
  }<div className="flex bg-secondary rounded-xl p-1 mb-6">{[{ k: true, l: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" }, { k: false, l: "\u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F" }].map((t) => <button
    key={String(t.k)}
    type="button"
    onClick={() => setIsLogin(t.k)}
    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin === t.k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
  >{t.l}</button>)}</div><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">{!isLogin && <FormField
    control={form.control}
    name="name"
    render={({ field }) => <FormItem><FormLabel>الاسم الكامل</FormLabel><FormControl><Input placeholder="محمد أحمد" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>}
  />}<FormField
    control={form.control}
    name="email"
    render={({ field }) => <FormItem><FormLabel>البريد الإلكتروني</FormLabel><FormControl><Input type="email" placeholder="name@example.com" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>}
  /><FormField
    control={form.control}
    name="password"
    render={({ field }) => <FormItem><FormLabel>كلمة المرور</FormLabel><FormControl><Input type="password" placeholder="••••••••" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>}
  />{!isLogin && <><FormField
    control={form.control}
    name="role"
    render={({ field }) => <FormItem><FormLabel>نوع الحساب</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="اختر الدور" /></SelectTrigger></FormControl><SelectContent><SelectItem value="student">طالب</SelectItem></SelectContent></Select><FormMessage /></FormItem>}
  />{role === "student" && <FormField
    control={form.control}
    name="grade"
    render={({ field }) => <FormItem><FormLabel>المرحلة الدراسية</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="اختر الصف" /></SelectTrigger></FormControl><SelectContent>{GRADES.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>}
  />}<FormField
    control={form.control}
    name="schoolCode"
    render={({ field }) => <FormItem><FormLabel>كود المدرسة (اختياري)</FormLabel><FormControl><Input placeholder="SCH-2024" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>}
  /></>}<Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground rounded-xl py-5 text-base">{submitting ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644..." : isLogin ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" : "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628"}</Button></form></Form></div>;
};
var AuthForm_default = AuthForm;
export {
  AuthForm_default as default
};
