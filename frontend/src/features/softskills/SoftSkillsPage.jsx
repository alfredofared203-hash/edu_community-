import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import SkillCard from "./SkillCard";
import SideCards from "./SideCards";

export default function SoftSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // نجيب المهارات الحقيقية من الباك (مش mock)
  useEffect(() => {
    api
      .getSoftSkills()
      .then((res) => {
        // شكل الرد: { success, data: { skills } }
        const list = res?.data?.skills || res?.skills || [];
        // نحوّل بيانات الـAPI للشكل اللي الكارت متوقّعه
        const mapped = list.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon || "HelpCircle",
          color: s.color || "blue",
          coursesCount: s.coursesCount || 0,
          // درجة الطالب في المهارة (لو موجودة) بتبقى نسبة التقدّم
          progress: typeof s.myGrade === "number" ? s.myGrade : 0,
          actionText: "ابدأ الآن ←",
        }));
        setSkills(mapped);
      })
      .catch((e) => setError(e.message || "تعذّر تحميل المهارات"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto bg-[#F9FAFC] min-h-screen text-right" dir="rtl">

      <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[160px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-40 transform translate-x-10 -translate-y-10"></div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-3">
          طور مهاراتك لمستقبل أفضل
        </h1>
        <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-3xl font-medium">
          اكتشف قوة المهارات الناعمة في تحويل مسارك المهني والأكاديمي. نحن نركز على تمكينك
          من خلال تطوير التواصل، القيادة، وإدارة الوقت لضمان تميزك في سوق العمل الحديث وبناء
          علاقات اجتماعية ناجحة.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex-1 order-2 lg:order-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-800">استكشف المهارات الأساسية</h2>
          </div>

          {/* حالات التحميل والخطأ والفراغ */}
          {loading && <p className="text-sm text-gray-400 mb-6">جاري تحميل المهارات...</p>}
          {error && <p className="text-sm text-red-500 mb-6">{error}</p>}
          {!loading && !error && skills.length === 0 && (
            <p className="text-sm text-gray-400 mb-6">لا توجد مهارات بعد.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SideCards />
        </div>

      </div>
    </div>
  );
}
