// features/chat/useChat.js
// Central hook: loads REST history, joins the room, sends & receives messages via Socket.IO.

import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { api } from "../../lib/api";

export function useChat(roomId) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const joinedRoomRef = useRef(null);

  // 1) Initial REST fetch when room changes.
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setMessages([]);
    setPage(1);
    setHasMore(true);
    api
      .getRoomMessages(roomId, { page: 1 })
      .then((res) => {
        if (cancelled) return;
        const list = res?.messages || res?.items || res || [];
        // الباك بيرجّع الأحدث أولاً — نعكسها عشان تظهر بالترتيب الزمني (الأقدم فوق)
        const chrono = Array.isArray(list) ? [...list].reverse() : [];
        setMessages(chrono);
        setHasMore(Array.isArray(list) && list.length > 0);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  // 2) Join the room on the socket + subscribe to new_message.
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;

    // الباك بيستقبل اسم الصف (grade) كنص مباشر في join_room
    socket.emit("join_room", roomId);
    joinedRoomRef.current = roomId;

    // الباك بيبثّ الرسالة كـ object مباشر (فيه grade)
    const onNewMessage = (msg) => {
      if (msg?.grade && msg.grade !== roomId) return; // تجاهل رسائل صف تاني
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("new_message", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [socket, isConnected, roomId]);

  // 3) Send message via socket.
  const sendMessage = useCallback(
    (text) => {
      const trimmed = (text || "").trim();
      if (!trimmed || !socket || !roomId) return;
      // الباك بيستقبل { grade, content }
      socket.emit("send_message", { grade: roomId, content: trimmed });
    },
    [socket, roomId]
  );

  // 4) Pagination — load older messages.
  const loadMore = useCallback(async () => {
    if (!roomId || loading || !hasMore) return;
    setLoading(true);
    try {
      const next = page + 1;
      const res = await api.getRoomMessages(roomId, { page: next });
      const list = res?.messages || res?.items || res || [];
      if (!Array.isArray(list) || list.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...list, ...prev]);
        setPage(next);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [roomId, page, loading, hasMore]);

  return { messages, sendMessage, loadMore, loading, hasMore, error, isConnected };
}
