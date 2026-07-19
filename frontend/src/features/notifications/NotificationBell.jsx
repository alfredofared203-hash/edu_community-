import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { api } from "../../lib/api";
import { useSocket } from "../../context/SocketContext";

// جرس الإشعارات — بيعرض عدد غير المقروء + قائمة منسدلة بالإشعارات.
// بيتحدّث لحظياً: أول ما يوصل إشعار جديد عبر Socket بنضيفه فوراً.
export default function NotificationBell() {
  const { socket } = useSocket(); // useSocket بيرجّع { socket, status, isConnected }
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // نجيب الإشعارات أول ما الكومبوننت يشتغل
  useEffect(() => {
    api
      .getNotifications()
      .then((res) => {
        const data = res?.data || res;
        setItems(data.notifications || []);
        setUnread(data.unread || 0);
      })
      .catch(() => {});
  }, []);

  // نسمع الإشعارات اللحظية من السوكت
  useEffect(() => {
    if (!socket) return;
    const onNotification = (n) => {
      setItems((prev) => [n, ...prev]);
      setUnread((u) => u + 1);
    };
    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, [socket]);

  // نقفل القائمة لما نضغط برّه
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function markAll() {
    await api.markAllNotificationsRead().catch(() => {});
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-accent/20 text-muted-foreground"
        aria-label="الإشعارات"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-lg z-50 text-right" dir="rtl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <span className="font-bold text-gray-800 text-sm">الإشعارات</span>
            {unread > 0 && (
              <button onClick={markAll} className="text-[11px] text-blue-600 font-bold hover:underline">
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          {items.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-gray-400">لا توجد إشعارات</p>
          )}

          {items.map((n) => (
            <div
              key={n.id || n._id}
              className={"px-4 py-3 border-b border-gray-50 " + (n.read ? "" : "bg-blue-50/50")}
            >
              <p className="text-sm font-bold text-gray-800">{n.title}</p>
              {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
              <p className="text-[10px] text-gray-400 mt-1">
                {n.createdAt ? new Date(n.createdAt).toLocaleString("ar-EG") : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
