// lib/socket.js
// Small helper responsible for creating/configuring a single Socket.IO client instance.
// Kept isolated so SocketContext (and tests) can import from one place without
// duplicating connection logic.

import { io } from "socket.io-client";

// Derive the socket URL from Vite env, falling back to the same host as REST.
// REST BASE_URL in lib/api.js is `${host}/api`, so we strip `/api` to reach the socket namespace root.
const REST_BASE = "http://localhost:5000/api";
export const SOCKET_URL =
  import.meta.env?.VITE_SOCKET_URL || REST_BASE.replace(/\/api\/?$/, "");

/**
 * Create a configured (but NOT yet connected when autoConnect=false) socket instance.
 * @param {string} token - JWT accessToken sent in the handshake `auth` payload.
 * @param {object} [opts] - extra overrides for socket.io-client options.
 */
export function createSocket(token, opts = {}) {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,      // 1s initial backoff
    reconnectionDelayMax: 5000,   // capped at 5s
    timeout: 10000,
    autoConnect: true,
    ...opts,
  });
}
