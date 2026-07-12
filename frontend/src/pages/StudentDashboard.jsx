import { useAuth } from "../context/AuthContext";
import { BookOpen, Star, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">أهلاً، {user?.name} 👋</h1>
        <p className="text-sm text-muted-foreground">لوحة تحكم الطالب</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">المواد</p>
            <p className="text-xl font-bold">0</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">النقاط</p>
            <p className="text-xl font-bold">0</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">الترتيب</p>
            <p className="text-xl font-bold">—</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
