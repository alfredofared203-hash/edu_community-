import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SubmitPresentationDialog({ skill, open, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("يرجى اختيار ملف");
    const formData = new FormData();
    formData.append("presentation", file);
    setLoading(true);
    try {
      await api.submitPresentation(skill.id, formData);
      toast.success("تم رفع البريزنتيشن بنجاح");
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
          <DialogTitle>رفع بريزنتيشن - {skill?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="presentation">اختر الملف (PDF / PPT)</Label>
            <Input
              id="presentation"
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الرفع..." : "رفع"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
