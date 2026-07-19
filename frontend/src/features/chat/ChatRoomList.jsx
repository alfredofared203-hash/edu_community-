import { useEffect, useMemo, useState } from "react";
import { Search, Users, GraduationCap, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { GRADES, gradeLabel } from "../../lib/grades";

const TABS = [
  { id: "individual", label: "فردي", icon: User },
  { id: "groups", label: "مجموعات", icon: Users },
  { id: "teachers", label: "المعلمون", icon: GraduationCap },
];

function initials(name = "?") {
  return name.trim().charAt(0) || "?";
}

function timeShort(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ChatRoomList({ activeRoom, onSelect }) {
  const { user } = useAuth();
  const loading = false;
  const error = null;
  const [tab, setTab] = useState("groups");
  const [query, setQuery] = useState("");

  // الغرف = صفوف دراسية (شات جماعي لكل صف).
  // الطالب يشوف صفّه بس · المدرس/الأدمن يشوف كل الصفوف.
  const rooms = useMemo(() => {
    if (!user) return [];
    const list = user.role === "student"
      ? [{ id: user.grade, isGroup: true }]
      : GRADES.map((g) => ({ id: g.value, isGroup: true }));
    return list.map((r) => ({ ...r, name: "شات " + gradeLabel(r.id) }));
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rooms.filter((r) => r.name.toLowerCase().includes(q));
  }, [rooms, query]);

  return (
    <aside className="w-80 shrink-0 border-l border-gray-100 bg-white h-full flex flex-col" dir="rtl">
      <div className="p-4 border-b border-gray-50 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث في المحادثات..."
            className="w-full bg-[#F4F6F9] text-sm text-gray-700 placeholder-gray-400 rounded-2xl py-3 pr-10 pl-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex bg-[#F4F6F9] p-1 rounded-xl justify-between gap-1">
          {TABS.map((t) => {
            const IconComponent = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  tab === t.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50/60">
        {loading && (
          <p className="text-sm text-gray-400 p-6 text-center font-medium">جاري تحميل المحادثات…</p>
        )}
        {error && (
          <p className="text-sm text-red-500 p-6 text-center font-medium">{error}</p>
        )}

        {!loading && filtered.length === 0 ? (
          <div className="text-sm text-gray-400 p-8 text-center font-medium">
            لا توجد محادثات في هذا القسم
          </div>
        ) : (
          filtered.map((r) => {
            const id = r._id || r.id || r.room;
            const name = r.name || r.title || id;
            const last = r.lastMessage?.text || r.lastMessage || "";
            const time = timeShort(
              r.lastMessage?.createdAt || r.updatedAt || r.lastActivityAt
            );
            const unread = r.unreadCount || 0;
            const isActive = activeRoom === id;

            return (
              <button
                key={id}
                onClick={() => onSelect(id, r)}
                className={`w-full p-4 flex items-start gap-3 transition text-right relative ${
                  isActive ? "bg-blue-50/60 border-r-4 border-blue-600" : "hover:bg-gray-50/60"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base border border-blue-100">
                    {initials(name)}
                  </div>
                  {r.online && (
                    <span className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm text-gray-800 truncate">{name}</h4>
                    {time && (
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                        {time}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate font-medium">
                    {last || "لا توجد رسائل بعد"}
                  </p>
                </div>

                {unread > 0 && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center">
                    {unread}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}