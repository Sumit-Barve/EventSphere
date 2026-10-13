import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import mongoose from "mongoose";

import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { initializeSocketIO } from "./sockets/socketServer.js";

// Handle uncaught exceptions before anything else
process.on("uncaughtException", (err) => {
  console.error(`[Uncaught Exception] ${err.name}: ${err.message}`);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});

const app = express();

// 1. Database Connection
connectDB();

// 2. Security Headers
app.use(helmet());

// 3. CORS Configuration
const isOriginAllowed = (origin) => {
  // Allow requests with no Origin header (e.g., uptime/health probes, curl, server-to-server)
  if (!origin) return true;
  return env.allowedOrigins.includes(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: Origin '${origin}' is not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 4. Request Body Size Limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 5. NoSQL Injection Sanitization (strips $, .)
app.use(mongoSanitize());

// 6. HTTP Request Logging
app.use(morgan(env.isProduction ? "combined" : "dev"));

// 7. General API Rate Limiting (100 req / 15 min per IP)
app.use("/api", apiLimiter);

// 8. Root Welcome & API Discovery Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EventSphere REST API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      events: "/api/events",
      frontend: env.CLIENT_URL,
    },
  });
});

// 9. Health Check Endpoint
app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (isDbConnected) {
    return res.status(200).json({
      success: true,
      message: "EventSphere API is healthy",
      database: "connected",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(503).json({
    success: false,
    message: "EventSphere API degraded - database unavailable",
    database: "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 10. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// 11. Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// 12. Create shared HTTP server and initialize Socket.IO
const httpServer = http.createServer(app);
const io = initializeSocketIO(httpServer);

// 13. Start HTTP & WebSocket Server
httpServer.listen(env.PORT, () => {
  console.log(`[Server Running] EventSphere API listening on http://localhost:${env.PORT}`);
  console.log(`[Environment] ${env.NODE_ENV}`);
  if (env.isEmailConfigured) {
    console.log(`[Email Service] Real email notifications configured (via ${env.SMTP_HOST}:${env.SMTP_PORT})`);
  } else {
    console.log(`[Email Service] Notice: Real email notifications not configured. Set SMTP_USER & SMTP_APP_PASSWORD in server/.env`);
  }
});

// 14. Graceful Shutdown & Unhandled Rejection Handlers
const handleGracefulShutdown = async (signal) => {
  console.log(`\n[${signal} Received] Closing HTTP/WebSocket server and database connection gracefully...`);
  if (io) {
    io.close(() => {
      console.log("[Socket.IO Closed] All WebSocket connections terminated.");
    });
  }
  httpServer.close(async () => {
    console.log("[Server Closed] HTTP server stopped accepting connections.");
    await disconnectDB();
    process.exit(0);
  });

  // Force exit after 10 seconds if shutdown hangs
  setTimeout(() => {
    console.error("[Shutdown Timeout] Forcing shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  console.error(`[Unhandled Rejection] ${err.name || "Error"}: ${err.message || err}`);
  if (err.stack) console.error(err.stack);
  handleGracefulShutdown("UNHANDLED_REJECTION");
});

export { app, httpServer, io };
export default app;
