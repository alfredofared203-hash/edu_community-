// context/SocketContext.jsx
// Singleton Socket.IO connection scoped to the authenticated user session.
// Exposes { socket, status, isConnected } via useSocket().

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { tokenStore } from "../lib/api";
import { createSocket } from "../lib/socket";

const SocketContext = createContext(undefined);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const token = tokenStore.getAccess();

  const [status, setStatus] = useState("disconnected"); // connecting | connected | disconnected
  const socketRef = useRef(null);

  useEffect(() => {
    // Do NOT open a connection if the user is not logged in.
    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setStatus("disconnected");
      }
      return;
    }

    setStatus("connecting");
    const socket = createSocket(token);
    socketRef.current = socket;

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    const onReconnectAttempt = () => setStatus("connecting");
    const onConnectError = (err) => {
      console.warn("[socket] connect_error:", err?.message || err);
      setStatus("disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.on("connect_error", onConnectError);

    // Clean teardown on logout / unmount.
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
      socketRef.current = null;
      setStatus("disconnected");
    };
  }, [user, token]);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      status,
      isConnected: status === "connected",
    }),
    [status]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
};
