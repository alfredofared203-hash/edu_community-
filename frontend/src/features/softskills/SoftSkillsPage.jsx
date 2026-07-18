import React from "react";
import { skillsData } from "./mockData";
import SkillCard from "./SkillCard";
import SideCards from "./SideCards";

export default function SoftSkillsPage() {
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
            <button className="text-xs font-bold text-blue-600 hover:underline">عرض الكل</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {skillsData.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-black text-gray-800 mb-4">دورة مقترحة لك اليوم</h2>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch min-h-[220px]">
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between text-right order-2 md:order-1">
                <div>
                  <span className="text-xs font-bold text-emerald-600 mb-2 block">مهارات التفكير الاستراتيجي</span>
                  <h3 className="text-xl font-black text-gray-800 mb-3">كيف تفكر كمخطط محترف؟</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
                    هذه الدورة ستعلمك كيفية تحليل المواقف المعقدة واتخاذ قرارات مبنية على بيانات ورؤية بعيدة المدى، بمشاركة نخبة من الخبراء.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 border-t border-gray-50 pt-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all">
                    ابدأ التعلم الآن
                  </button>
                  <span className="text-xs text-gray-400 font-medium">⏱️ 4 ساعات تدريبية</span>
                </div>
              </div>

              <div className="w-full md:w-[240px] bg-gradient-to-br from-blue-500 to-indigo-600 relative flex items-center justify-center p-6 text-white text-center order-1 md:order-2 min-h-[160px] md:min-h-full">
                <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  الأكثر طلباً 
                </span>
                <div className="space-y-2">
                  <div className="text-3xl">💡</div>
                  <h4 className="font-black text-sm">المهارات الناعمة - Soft Skills</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SideCards />
        </div>

      </div>
    </div>
  );
}