import { useState } from "react";
import { FileText, Video, Image as ImageIcon, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { gradeLabel } from "../../lib/grades";
import { resolveFileUrl, subjectName, uploaderName } from "./utils";
const TYPE_META = {
  pdf: { icon: FileText, label: "PDF", color: "bg-red-100 text-red-700" },
  video: { icon: Video, label: "\u0641\u064A\u062F\u064A\u0648", color: "bg-blue-100 text-blue-700" },
  graphic: { icon: ImageIcon, label: "\u062C\u0631\u0627\u0641\u064A\u0643", color: "bg-emerald-100 text-emerald-700" }
};
const MaterialCard = ({ material, canDelete, onDelete }) => {
  const [open, setOpen] = useState(false);
  const meta = TYPE_META[material.type];
  const Icon = meta.icon;
  const url = resolveFileUrl(material.fileUrl);
  return <><Card className="p-5 flex flex-col gap-3 h-full hover:shadow-md transition-shadow"><div className="flex items-start justify-between gap-2"><div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.color}`}><Icon className="w-5 h-5" /></div><div className="flex gap-1.5 flex-wrap justify-end"><Badge variant="secondary">{meta.label}</Badge>{material.isNextGrade && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">الصف التالي</Badge>}</div></div><div><h3 className="font-display font-bold text-foreground leading-snug">{material.title}</h3><p className="text-xs text-muted-foreground mt-1">{subjectName(material)} • {gradeLabel(material.grade)}</p></div>{material.description && <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>}<div className="flex items-center justify-between mt-auto pt-2"><span className="text-xs text-muted-foreground truncate">{uploaderName(material)}</span><div className="flex items-center gap-1.5">{canDelete && onDelete && <Button
    variant="ghost"
    size="icon"
    className="text-muted-foreground hover:text-destructive"
    onClick={() => onDelete(material.id)}
    title="حذف"
  ><Trash2 className="w-4 h-4" /></Button>}<Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}><Eye className="w-4 h-4" /> عرض
            </Button></div></div></Card><Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{material.title}</DialogTitle></DialogHeader>{material.type === "video" ? <iframe
    src={url}
    title={material.title}
    className="w-full aspect-video rounded-lg border-0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  /> : material.type === "graphic" ? <img src={url} alt={material.title} className="w-full rounded-lg" /> : <iframe src={url} title={material.title} className="w-full h-[70vh] rounded-lg border" />}<a href={url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
            فتح في تبويب جديد
          </a></DialogContent></Dialog></>;
};
var MaterialCard_default = MaterialCard;
export {
  MaterialCard_default as default
};
