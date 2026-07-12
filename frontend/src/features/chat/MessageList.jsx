// features/chat/MessageList.jsx
import { useEffect, useRef } from "react";
import { Check, CheckCheck, FileText, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function fmtTime(d) {
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

function dayLabel(d) {
  if (!d) return "";
  const date = new Date(d);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(date, today)) return "اليوم";
  if (sameDay(date, yest)) return "أمس";
  return date.toLocaleDateString("ar-EG");
}

export default function MessageList({ messages, onLoadMore, hasMore, loading }) {
  const bottomRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  let lastDay = null;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-muted/20">
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 bg-card rounded-full px-3 py-1 shadow-sm"
          >
            {loading ? "جاري التحميل…" : "تحميل رسائل أقدم"}
          </button>
        </div>
      )}

      {messages.map((m, i) => {
        const id = m._id || m.id || i;
        const senderId = m.sender?._id || m.sender?.id || m.user?._id || m.userId;
        const isMine =
          m.mine === true ||
          (user && senderId && String(senderId) === String(user._id || user.id));
        const text = m.text || m.content || "";
        const time = fmtTime(m.createdAt || m.timestamp);
        const day = dayLabel(m.createdAt || m.timestamp);
        const showDay = day && day !== lastDay;
        if (showDay) lastDay = day;
        const file = m.file || m.attachment;
        const read = m.read || m.seen;

        return (
          <div key={id}>
            {showDay && (
              <div className="flex justify-center my-4">
                <span className="text-[11px] text-muted-foreground bg-card rounded-full px-3 py-1 shadow-sm">
                  {day}
                </span>
              </div>
            )}
            <div className={`flex ${isMine ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[75%] flex flex-col ${isMine ? "items-start" : "items-end"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-bl-sm"
                      : "bg-card text-foreground rounded-br-sm"
                  }`}
                >
                  {text && <p className="whitespace-pre-wrap">{text}</p>}
                  {file && (
                    <a
                      href={file.url || "#"}
                      download
                      className={`mt-2 flex items-center gap-2 rounded-xl p-2 ${
                        isMine ? "bg-white/15" : "bg-muted/60"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isMine ? "bg-white/20" : "bg-primary/15 text-primary"}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="truncate font-medium">{file.name || "ملف"}</p>
                        {file.size && <p className="opacity-70">{file.size}</p>}
                      </div>
                      <Download className="w-4 h-4 opacity-70" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-muted-foreground">
                  {isMine && (
                    read ? <CheckCheck className="w-3.5 h-3.5 text-primary" /> : <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{time}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
