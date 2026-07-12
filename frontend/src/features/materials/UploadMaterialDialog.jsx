import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { GRADES, MATERIAL_TYPES } from "../../lib/grades";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
const UploadMaterialDialog = ({ defaultGrade }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState(defaultGrade || "sec-1");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("pdf");
  const [isNextGrade, setIsNextGrade] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects", grade],
    queryFn: () => api.getSubjects(grade),
    enabled: open
  });
  const subjects = subjectsData?.subjects || [];
  const reset = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setType("pdf");
    setIsNextGrade(false);
    setFile(null);
    setFileUrl("");
  };
  const mutation = useMutation({
    mutationFn: (formData) => api.createMaterial(formData),
    onSuccess: () => {
      toast.success("\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0627\u062F\u0629 \u0628\u0646\u062C\u0627\u062D");
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err.message || "\u0641\u0634\u0644 \u0631\u0641\u0639 \u0627\u0644\u0645\u0627\u062F\u0629")
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !subject || !grade) {
      toast.error("\u0628\u0631\u062C\u0627\u0621 \u0645\u0644\u0621 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0627\u0644\u0635\u0641 \u0648\u0627\u0644\u0645\u0627\u062F\u0629");
      return;
    }
    if (!file && !fileUrl) {
      toast.error("\u0627\u0631\u0641\u0639 \u0645\u0644\u0641\u0627\u064B \u0623\u0648 \u0623\u062F\u062E\u0644 \u0631\u0627\u0628\u0637\u0627\u064B");
      return;
    }
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("subject", subject);
    fd.append("grade", grade);
    fd.append("type", type);
    fd.append("isNextGrade", String(isNextGrade));
    if (file) fd.append("file", file);
    else if (fileUrl) fd.append("fileUrl", fileUrl);
    mutation.mutate(fd);
  };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="gap-2 gradient-primary text-primary-foreground rounded-xl"><Plus className="w-4 h-4" /> إضافة مادة
        </Button></DialogTrigger><DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>إضافة مادة تعليمية</DialogTitle></DialogHeader><form onSubmit={handleSubmit} className="space-y-4"><div className="space-y-1.5"><Label>العنوان</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: ملخص قوانين نيوتن" /></div><div className="space-y-1.5"><Label>الوصف (اختياري)</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label>الصف</Label><Select value={grade} onValueChange={(v) => {
    setGrade(v);
    setSubject("");
  }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{GRADES.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>المادة</Label><Select value={subject} onValueChange={setSubject} disabled={!subjects.length}><SelectTrigger><SelectValue placeholder={subjects.length ? "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0627\u062F\u0629" : "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0648\u0627\u062F \u0644\u0647\u0630\u0627 \u0627\u0644\u0635\u0641"} /></SelectTrigger><SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div></div><div className="space-y-1.5"><Label>نوع المحتوى</Label><Select value={type} onValueChange={(v) => setType(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MATERIAL_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>رفع ملف (PDF / صورة / فيديو)</Label><Input
    type="file"
    accept=".pdf,image/*,video/mp4,video/webm"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
  /></div><div className="space-y-1.5"><Label>أو رابط خارجي (مثل رابط فيديو يوتيوب embed)</Label><Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." /></div><div className="flex items-center justify-between rounded-xl border p-3"><div><Label className="cursor-pointer">مادة الصف التالي</Label><p className="text-xs text-muted-foreground">للتحضير في الإجازة</p></div><Switch checked={isNextGrade} onCheckedChange={setIsNextGrade} /></div><DialogFooter><Button type="submit" disabled={mutation.isPending} className="gap-2 w-full"><Upload className="w-4 h-4" />{mutation.isPending ? "\u062C\u0627\u0631\u064D \u0627\u0644\u0631\u0641\u0639..." : "\u0631\u0641\u0639 \u0627\u0644\u0645\u0627\u062F\u0629"}</Button></DialogFooter></form></DialogContent></Dialog>;
};
var UploadMaterialDialog_default = UploadMaterialDialog;
export {
  UploadMaterialDialog_default as default
};
