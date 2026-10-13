import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

/**
 * Authentication Middleware: Verifies JWT from Authorization: Bearer <token>
 */
export const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("Not authorized to access this resource. Please provide a valid Bearer token.", 401)
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Authentication token has expired. Please log in again.", 401));
      }
      return next(new AppError("Invalid authentication token. Verification failed.", 401));
    }

    // Check if user still exists in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based Authorization Middleware: Restricts access to specific user roles
 * @param  {...string} allowedRoles - e.g. "ADMIN", "ORGANIZER", "PARTICIPANT"
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authenticated. Access denied.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role '${req.user.role}' is not authorized to perform this action. Required: [${allowedRoles.join(", ")}]`,
          403
        )
      );
    }

    next();
  };
};
