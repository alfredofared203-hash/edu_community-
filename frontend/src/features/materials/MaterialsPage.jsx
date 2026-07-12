import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { GRADES, MATERIAL_TYPES, gradeLabel } from "../../lib/grades";
import { uploaderId } from "./utils";
import MaterialCard from "./MaterialCard";
import UploadMaterialDialog from "./UploadMaterialDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
const ALL = "all";
const MaterialsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const canManage = user?.role === "teacher" || user?.role === "admin";
  const [grade, setGrade] = useState(user?.grade || "sec-1");
  const [subject, setSubject] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [search, setSearch] = useState("");
  const [nextGrade, setNextGrade] = useState(false);
  const [page, setPage] = useState(1);
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects", grade],
    queryFn: () => api.getSubjects(grade)
  });
  const subjects = subjectsData?.subjects || [];
  const params = useMemo(
    () => ({
      grade,
      subject: subject === ALL ? void 0 : subject,
      type: type === ALL ? void 0 : type,
      search: search || void 0,
      isNextGrade: nextGrade ? "true" : void 0,
      page,
      limit: 9
    }),
    [grade, subject, type, search, nextGrade, page]
  );
  const { data, isLoading, isError } = useQuery({
    queryKey: ["materials", params],
    queryFn: () => api.getMaterials(params)
  });
  const materials = data?.materials || [];
  const meta = data?.meta;
  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteMaterial(id),
    onSuccess: () => {
      toast.success("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0627\u062F\u0629");
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (err) => toast.error(err.message || "\u0641\u0634\u0644 \u0627\u0644\u062D\u0630\u0641")
  });
  const onFilterChange = (setter) => (v) => {
    setter(v);
    setPage(1);
  };
  return <div className="max-w-6xl mx-auto"><div className="flex items-center justify-between mb-6 flex-wrap gap-3"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center"><BookOpen className="w-6 h-6 text-primary-foreground" /></div><div><h1 className="text-2xl font-display font-bold text-foreground">المواد التعليمية</h1><p className="text-sm text-muted-foreground">تصفّح ملفات ودروس وفيديوهات صفّك</p></div></div>{canManage && <UploadMaterialDialog defaultGrade={grade} />}</div>{
    /* الفلاتر */
  }<div className="bg-card border border-border rounded-2xl p-4 mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4"><div className="space-y-1.5"><Label className="text-xs">الصف</Label><Select value={grade} onValueChange={onFilterChange((v) => {
    setGrade(v);
    setSubject(ALL);
  })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{GRADES.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label className="text-xs">المادة</Label><Select value={subject} onValueChange={onFilterChange(setSubject)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>كل المواد</SelectItem>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label className="text-xs">النوع</Label><Select value={type} onValueChange={onFilterChange(setType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>كل الأنواع</SelectItem>{MATERIAL_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label className="text-xs">بحث</Label><div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input
    value={search}
    onChange={(e) => onFilterChange(setSearch)(e.target.value)}
    placeholder="ابحث بالعنوان..."
    className="pr-9"
  /></div></div><div className="flex items-center gap-2 lg:col-span-4"><Switch id="next" checked={nextGrade} onCheckedChange={onFilterChange(setNextGrade)} /><Label htmlFor="next" className="cursor-pointer text-sm">
            مواد الصف التالي فقط (للتحضير في الإجازة)
          </Label></div></div>{
    /* النتائج */
  }{isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}</div> : isError ? <div className="text-center py-16 text-muted-foreground">تعذّر تحميل المواد. تأكّد أن السيرفر يعمل.</div> : materials.length === 0 ? <div className="text-center py-16"><BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" /><p className="text-muted-foreground">لا توجد مواد مطابقة لـ {gradeLabel(grade)}.</p></div> : <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{materials.map((m) => <MaterialCard
    key={m.id}
    material={m}
    canDelete={user?.role === "admin" || canManage && uploaderId(m) === user?.id}
    onDelete={(id) => deleteMutation.mutate(id)}
  />)}</div>{
    /* ترقيم الصفحات */
  }{meta && meta.totalPages > 1 && <div className="flex items-center justify-center gap-3 mt-8"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="gap-1"><ChevronRight className="w-4 h-4" /> السابق
              </Button><span className="text-sm text-muted-foreground">صفحة {meta.page} من {meta.totalPages}</span><Button variant="outline" size="sm" disabled={!meta.hasNextPage} onClick={() => setPage((p) => p + 1)} className="gap-1">
                التالي <ChevronLeft className="w-4 h-4" /></Button></div>}</>}</div>;
};
var MaterialsPage_default = MaterialsPage;
export {
  MaterialsPage_default as default
};
