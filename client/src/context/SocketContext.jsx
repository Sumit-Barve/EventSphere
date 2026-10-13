import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useApp } from "../hooks/useApp";

export const SocketContext = createContext(null);

// Resolve Socket.IO server origin dynamically with local development fallback
const RAW_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const SOCKET_SERVER_URL = RAW_SOCKET_URL.replace(/\/+$/, "");

export function SocketProvider({ children }) {
  const { token, isAuthenticated, user } = useAuth();
  const { showToast } = useApp();

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // 'connected' | 'connecting' | 'disconnected'
  const [socketId, setSocketId] = useState(null);
  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    // Only connect if authenticated with a valid JWT token
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setConnectionStatus("disconnected");
        setSocketId(null);
      }
      return;
    }

    setConnectionStatus("connecting");

    // Initialize Socket.IO connection with JWT token in auth handshake
    const socketInstance = io(SOCKET_SERVER_URL, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setConnectionStatus("connected");
      setSocketId(socketInstance.id);
      console.log(`[Socket.IO Client] Connected to real-time server (ID: ${socketInstance.id})`);
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      setConnectionStatus("disconnected");
      setSocketId(null);
      console.log(`[Socket.IO Client] Disconnected: ${reason}`);
    });

    socketInstance.on("connect_error", (error) => {
      setIsConnected(false);
      setConnectionStatus("disconnected");
      console.warn(`[Socket.IO Client] Connection error:`, error.message);
    });

    // Global incoming notification handler
    socketInstance.on("notification:new", (notification) => {
      setLastNotification(notification);

      // Trigger reactive toast notification
      const toastType =
        notification.type === "EVENT_REJECTED"
          ? "warning"
          : notification.type === "EVENT_APPROVED" || notification.type === "NEW_REGISTRATION"
          ? "success"
          : "info";

      showToast(notification.message || notification.title, toastType);
    });

    setSocket(socketInstance);

    // Cleanup on unmount or token change
    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.off("notification:new");
      socketInstance.disconnect();
    };
  }, [token, isAuthenticated, showToast]);

  const value = {
    socket,
    isConnected,
    connectionStatus,
    socketId,
    lastNotification,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
