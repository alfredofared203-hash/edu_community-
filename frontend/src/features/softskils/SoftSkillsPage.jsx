import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import SkillCard from "./SkillCard";
import SideCards from "./SideCards";
import SubmitPresentationDialog from "./SubmitPresentationDialog";
import GradeSubmissionDialog from "./GradeSubmissionDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SoftSkillsPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Submit dialog
  const [submitSkill, setSubmitSkill] = useState(null);

  // Grade dialog
  const [gradeTarget, setGradeTarget] = useState(null); // { skill, submission }
  const [submissions, setSubmissions] = useState({}); // { [skillId]: [] }
  const [expandedSkill, setExpandedSkill] = useState(null);

  const fetchSkills = async () => {
    try {
      const data = await api.getSoftSkills();
      setSkills(Array.isArray(data) ? data : data.skills ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const loadSubmissions = async (skillId) => {
    if (submissions[skillId]) {
      setExpandedSkill(expandedSkill === skillId ? null : skillId);
      return;
    }
    try {
      const data = await api.getSoftSkillSubmissions(skillId);
      setSubmissions((prev) => ({ ...prev, [skillId]: Array.isArray(data) ? data : data.submissions ?? [] }));
      setExpandedSkill(skillId);
    } catch {
      setExpandedSkill(skillId);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto bg-[#F9FAFC] min-h-screen text-right" dir="rtl">

      {/* البانر العلوي */}
      <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[160px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-40 transform translate-x-10 -translate-y-10" />
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-3">طور مهاراتك لمستقبل أفضل</h1>
        <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-3xl font-medium">
          اكتشف قوة المهارات الناعمة في تحويل مسارك المهني والأكاديمي. نحن نركز على تمكينك
          من خلال تطوير التواصل، القيادة، وإدارة الوقت لضمان تميزك في سوق العمل الحديث.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 order-2 lg:order-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-800">استكشف المهارات الأساسية</h2>
          </div>

          {loading && <p className="text-gray-400 text-sm">جاري التحميل...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {skills.map((skill) => (
              <div key={skill.id} className="flex flex-col gap-2">
                <SkillCard skill={skill} />

                <div className="flex gap-2 px-1">
                  {/* زر رفع بريزنتيشن (للطالب) */}
                  {!isTeacher && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => setSubmitSkill(skill)}
                    >
                      رفع بريزنتيشن
                    </Button>
                  )}

                  {/* زر عرض التسليمات (للمدرس) */}
                  {isTeacher && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => loadSubmissions(skill.id)}
                    >
                      {expandedSkill === skill.id ? "إخفاء التسليمات" : "عرض التسليمات"}
                    </Button>
                  )}

                  {/* درجة الطالب */}
                  {!isTeacher && skill.myGrade != null && (
                    <Badge variant="secondary" className="text-xs px-3">
                      درجتك: {skill.myGrade}
                    </Badge>
                  )}
                </div>

                {/* قائمة التسليمات للمدرس */}
                {isTeacher && expandedSkill === skill.id && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
                    {(submissions[skill.id] ?? []).length === 0 ? (
                      <p className="text-xs text-gray-400">لا توجد تسليمات بعد</p>
                    ) : (
                      (submissions[skill.id] ?? []).map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2 last:border-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-blue-600 h-auto p-0"
                            onClick={() => setGradeTarget({ skill, submission: sub })}
                          >
                            {sub.grade != null ? `تعديل الدرجة (${sub.grade})` : "تصحيح"}
                          </Button>
                          <span className="text-gray-700 font-medium">{sub.studentName}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SideCards />
        </div>
      </div>

      {/* Dialogs */}
      {submitSkill && (
        <SubmitPresentationDialog
          skill={submitSkill}
          open={!!submitSkill}
          onClose={() => setSubmitSkill(null)}
          onSuccess={fetchSkills}
        />
      )}

      {gradeTarget && (
        <GradeSubmissionDialog
          submission={gradeTarget.submission}
          open={!!gradeTarget}
          onClose={() => setGradeTarget(null)}
          onSuccess={() => {
            setSubmissions((prev) => ({ ...prev, [gradeTarget.skill.id]: undefined }));
            loadSubmissions(gradeTarget.skill.id);
          }}
        />
      )}
    </div>
  );
}
