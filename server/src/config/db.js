import mongoose from "mongoose";
import { env } from "./env.js";

/**
 * Connect to MongoDB database with secure production-ready settings
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: !env.isProduction, // Disable auto-indexing in production for performance
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Failed to connect: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Gracefully close MongoDB database connection
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("[MongoDB Disconnected] Database connection closed safely.");
  } catch (error) {
    console.error(`[MongoDB Disconnect Error] ${error.message}`);
  }
};
