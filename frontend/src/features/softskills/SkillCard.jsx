import React from "react";
import * as Icons from "lucide-react";

export default function SkillCard({ skill }) {
  const IconComponent = Icons[skill.icon] || Icons.HelpCircle;

  const colorClasses = {
    blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-600" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-600" },
    amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-600" },
    indigo: { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-600" },
  };

  const currentStyle = colorClasses[skill.color] || colorClasses.blue;

  const radius = 18;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (skill.progress / 100) * strokeDasharray;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[260px] relative text-right">
      <div className="flex justify-between items-center w-full">
        <div className="relative flex items-center justify-center w-12 h-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r={radius} className="text-gray-150" strokeWidth="3" stroke="currentColor" fill="transparent" />
            <circle cx="24" cy="24" r={radius} className={currentStyle.text} strokeWidth="3" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" />
          </svg>
          <span className="absolute text-[11px] font-bold text-gray-700">{skill.progress}%</span>
        </div>
        <div className={`p-3 rounded-2xl ${currentStyle.bg} ${currentStyle.text}`}>
          <IconComponent size={22} />
        </div>
      </div>

      <div className="mt-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{skill.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">{skill.description}</p>
      </div>

      <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-2 text-xs">
        <button className={`${currentStyle.text} font-bold hover:underline transition-all`}>
          {skill.actionText}
        </button>
        <span className="text-gray-400 font-medium">{skill.coursesCount} دورة متاحة</span>
      </div>
    </div>
  );
}
