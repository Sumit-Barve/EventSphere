import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

let io = null;

/**
 * Initialize Socket.IO with HTTP server instance and configure JWT authentication & rooms.
 */
export const initializeSocketIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT Authentication Middleware for WebSocket Connections
  io.use((socket, next) => {
    try {
      // Extract token from handshake auth or headers
      let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

      if (!token) {
        return next(new Error("Authentication error: Missing token"));
      }

      // Strip "Bearer " prefix if present
      if (typeof token === "string" && token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
      }

      // Verify JWT token
      const decoded = jwt.verify(token, env.JWT_SECRET);

      const userId = (decoded.userId || decoded.id || "").toString();
      const role = decoded.role || "PARTICIPANT";

      if (!userId) {
        return next(new Error("Authentication error: Invalid token payload"));
      }

      // Attach verified user data to socket
      socket.user = {
        id: userId,
        role: role,
      };

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new Error("Authentication error: Token expired"));
      }
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Connection Lifecycle Handler
  io.on("connection", (socket) => {
    const { id: userId, role } = socket.user;

    // Join deterministic user room and role room
    const userRoom = `user:${userId}`;
    const roleRoom = `role:${role}`;

    socket.join(userRoom);
    socket.join(roleRoom);

    if (env.isDevelopment) {
      console.log(`[Socket] Connected: ${socket.id} | User: ${userId} | Role: ${role}`);
      console.log(`[Socket] Joined rooms: ${userRoom}, ${roleRoom}`);
    }

    // Disconnect event
    socket.on("disconnect", (reason) => {
      if (env.isDevelopment) {
        console.log(`[Socket] Disconnected: ${socket.id} (User: ${userId}) | Reason: ${reason}`);
      }
    });

    // Handle client error events safely
    socket.on("error", (error) => {
      console.error(`[Socket Error] ${socket.id}:`, error);
    });
  });

  console.log("[Socket.IO] WebSocket server initialized and listening for connections.");
  return io;
};

/**
 * Access the active Socket.IO server instance safely
 */
export const getIO = () => {
  if (!io) {
    console.warn("[Socket.IO] getIO called before server initialization.");
  }
  return io;
};

/**
 * Emit event to a specific authenticated user's room
 */
export const emitToUser = (userId, eventName, payload) => {
  try {
    if (!io) return;
    const room = `user:${userId.toString()}`;
    io.to(room).emit(eventName, payload);
    if (env.isDevelopment) {
      console.log(`[Socket Emit -> User ${userId}] ${eventName}`);
    }
  } catch (err) {
    console.error(`[Socket Emit Error -> User ${userId}]:`, err.message);
  }
};

/**
 * Emit event to a specific role room (ADMIN, ORGANIZER, PARTICIPANT)
 */
export const emitToRole = (role, eventName, payload) => {
  try {
    if (!io) return;
    const room = `role:${role.toUpperCase()}`;
    io.to(room).emit(eventName, payload);
    if (env.isDevelopment) {
      console.log(`[Socket Emit -> Role ${role}] ${eventName}`);
    }
  } catch (err) {
    console.error(`[Socket Emit Error -> Role ${role}]:`, err.message);
  }
};

/**
 * Broadcast event to all connected clients
 */
export const broadcastEvent = (eventName, payload) => {
  try {
    if (!io) return;
    io.emit(eventName, payload);
    if (env.isDevelopment) {
      console.log(`[Socket Broadcast] ${eventName}`);
    }
  } catch (err) {
    console.error(`[Socket Broadcast Error]:`, err.message);
  }
};

/**
 * Helper to emit standardized notification to a user
 */
export const emitNotificationToUser = (userId, notification) => {
  const payload = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ...notification,
    timestamp: notification.timestamp || new Date().toISOString(),
  };
  emitToUser(userId, "notification:new", payload);
};

/**
 * Helper to emit standardized notification to a role
 */
export const emitNotificationToRole = (role, notification) => {
  const payload = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ...notification,
    timestamp: notification.timestamp || new Date().toISOString(),
  };
  emitToRole(role, "notification:new", payload);
};
