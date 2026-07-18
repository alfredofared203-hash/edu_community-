import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function GradeSubmissionDialog({ submission, open, onClose, onSuccess }) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gradeNum = Number(grade);
    if (!grade || isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100)
      return toast.error("يرجى إدخال درجة صحيحة بين 0 و 100");
    setLoading(true);
    try {
      await api.gradeSubmission(submission.id, { grade: gradeNum, feedback });
      toast.success("تم حفظ الدرجة بنجاح");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>تصحيح البريزنتيشن - {submission?.studentName}</DialogTitle>
        </DialogHeader>
        {submission?.fileUrl && (
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm underline"
          >
            عرض الملف المرفوع
          </a>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grade">الدرجة (0 - 100)</Label>
            <Input
              id="grade"
              type="number"
              min={0}
              max={100}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="مثال: 85"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">ملاحظات (اختياري)</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="أضف ملاحظاتك هنا..."
              rows={3}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الحفظ..." : "حفظ الدرجة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
