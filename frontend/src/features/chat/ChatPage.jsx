// features/chat/ChatPage.jsx
import { useMemo, useState } from "react";
import { Phone, Video, MoreVertical, MessagesSquare } from "lucide-react";
import { SocketProvider } from "../../context/SocketContext";
import ChatRoomList from "./ChatRoomList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChat } from "./useChat";

function initials(name = "?") {
  return name.trim().charAt(0) || "?";
}

function ChatInner() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeMeta, setActiveMeta] = useState(null);
  const { messages, sendMessage, loadMore, hasMore, loading, isConnected } =
    useChat(activeRoom);

  const roomName = activeMeta?.name || activeMeta?.title || activeRoom || "";

  const handleSelect = (id, meta) => {
    setActiveRoom(id);
    setActiveMeta(meta || null);
  };

  const header = useMemo(
    () => (
      <header className="border-b border-border px-4 py-3 flex items-center gap-3 bg-card">
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground">
          <Phone className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-sm">{roomName}</p>
            <p
              className={`text-xs ${
                isConnected ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {isConnected ? "متصل الآن" : "غير متصل"}
            </p>
          </div>
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold">
              {initials(roomName)}
            </div>
            {isConnected && (
              <span className="absolute bottom-0 left-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
            )}
          </div>
        </div>
      </header>
    ),
    [roomName, isConnected]
  );

  return (
    <div
      dir="rtl"
      className="flex h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-border bg-background shadow-sm"
    >
      <ChatRoomList
        activeRoom={activeRoom}
        onSelect={(id, meta) => handleSelect(id, meta)}
      />
      <section className="flex-1 flex flex-col min-w-0">
        {activeRoom ? (
          <>
            {header}
            <MessageList
              messages={messages}
              onLoadMore={loadMore}
              hasMore={hasMore}
              loading={loading}
            />
            <MessageInput onSend={sendMessage} disabled={!isConnected} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 bg-muted/20">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <MessagesSquare className="w-10 h-10" />
            </div>
            <p className="font-semibold text-foreground">مرحبًا بك في المحادثات</p>
            <p className="text-sm">اختر محادثة من القائمة لبدء الدردشة</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ChatPage() {
  return (
    <SocketProvider>
      <ChatInner />
    </SocketProvider>
  );
}
