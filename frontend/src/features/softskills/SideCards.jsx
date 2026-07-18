import React from "react";
import { Download, Share2, Award, Trophy, MessageSquare } from "lucide-react";
import { certificatesData } from "./mockData";

export default function SideCards() {
  return (
    <div className="flex flex-col gap-6 w-full lg:w-[280px]">
      
      {/* 1. بطاقة إحصائيات المهارات (الزرقاء) */}
      <div className="bg-blue-600 rounded-3xl p-5 text-white text-right relative overflow-hidden shadow-md">
        <div className="absolute top-4 left-4 opacity-25">
          <Trophy size={28} />
        </div>
        <p className="text-xs opacity-80 mb-4 font-medium">إحصائيات المهارات</p>
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <h4 className="text-3xl font-black">48</h4>
            <p className="text-[10px] opacity-75">ساعة تطوير</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-black">12</h4>
            <p className="text-[10px] opacity-75">مهارة مكتملة</p>
          </div>
        </div>
        <div className="bg-blue-700 bg-opacity-40 rounded-xl p-2.5 text-center text-[11px] font-medium">
          أنت في <span className="font-bold underline">المركز الأول</span> على مستوى مجموعتك هذا الأسبوع!
        </div>
      </div>

      {/* 2. بطاقة الشهادات */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-right">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">3 جديدة</span>
          <h3 className="text-sm font-bold text-gray-800">شهاداتي</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {certificatesData.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
              <div className="flex gap-2 items-center">
                <button className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-xl">
                  {cert.id === 2 ? <Share2 size={14} /> : <Download size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="text-xs font-bold text-gray-800">{cert.title}</h4>
                  <p className="text-[10px] text-gray-400">{cert.date}</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <Award size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full text-center text-xs text-gray-500 font-bold border border-dashed border-gray-200 rounded-2xl py-2.5 mt-4 hover:bg-gray-50 transition-all">
          عرض كافة الشهادات
        </button>
      </div>

      {/* 3. بطاقة تحدي المهارات (الخضراء) */}
      <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100 text-right relative shadow-sm">
        <h3 className="text-sm font-black text-emerald-800 mb-1">تحدي المهارات!</h3>
        <p className="text-xs text-emerald-700 opacity-90 leading-relaxed mb-4">
          نافس زملائك في حل معضلات قيادية واربح شارة "القائد الحكيم".
        </p>
        <button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl py-2.5 text-xs font-bold transition-all shadow-sm">
          خوض التحدي
        </button>
        <div className="absolute -bottom-2 -left-2 bg-amber-700 text-white p-2.5 rounded-2xl shadow-md cursor-pointer hover:scale-105 transition-all">
          <MessageSquare size={16} />
        </div>
      </div>

    </div>
  );
}
