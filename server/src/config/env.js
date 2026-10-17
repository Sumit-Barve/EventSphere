import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Validate and export sanitized environment configuration
 */
const validateEnv = () => {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const PORT = parseInt(process.env.PORT || "5000", 10);
  const MONGO_URI = process.env.MONGO_URI || "";
  const rawClientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  // Support comma-separated origins (e.g. for production Vercel + custom domain or preview URLs)
  const configuredOrigins = rawClientUrl
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  // Default origins for local development
  const localDevOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5173",
  ];

  // In development, allow local development ports; in production, restrict strictly to configured origins
  const allowedOrigins = Array.from(
    new Set([
      ...configuredOrigins,
      ...(NODE_ENV === "development" ? localDevOrigins : []),
    ])
  );

  const CLIENT_URL = configuredOrigins[0] || "http://localhost:5173";
  const JWT_SECRET = process.env.JWT_SECRET || "eventsphere_super_secure_jwt_secret_key_2026_practical6";
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

  // SMTP Email Notification Configuration (Gmail SMTP)
  const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
  const SMTP_SECURE = process.env.SMTP_SECURE === "false" ? false : true;
  const SMTP_USER = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : "";
  const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD ? process.env.SMTP_APP_PASSWORD.trim() : "";
  const EMAIL_FROM = process.env.EMAIL_FROM || (SMTP_USER ? `"EventSphere" <${SMTP_USER}>` : '"EventSphere" <noreply@eventsphere.local>');

  // Basic sanity validation
  if (isNaN(PORT) || PORT <= 0 || PORT > 65535) {
    console.error(`[Configuration Error] Invalid PORT specified: "${process.env.PORT}"`);
    process.exit(1);
  }

  if (!MONGO_URI || typeof MONGO_URI !== "string" || !MONGO_URI.startsWith("mongodb")) {
    console.error("[Configuration Error] Missing or invalid MONGO_URI in environment configuration.");
    process.exit(1);
  }

  if (!JWT_SECRET || typeof JWT_SECRET !== "string" || JWT_SECRET.trim().length < 8) {
    console.error("[Configuration Error] JWT_SECRET must be at least 8 characters long.");
    process.exit(1);
  }

  const isEmailConfigured = Boolean(SMTP_USER && SMTP_APP_PASSWORD);

  return {
    NODE_ENV,
    PORT,
    MONGO_URI,
    CLIENT_URL,
    allowedOrigins,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_APP_PASSWORD,
    EMAIL_FROM,
    isEmailConfigured,
    isProduction: NODE_ENV === "production",
    isDevelopment: NODE_ENV === "development",
  };
};

export const env = validateEnv();
