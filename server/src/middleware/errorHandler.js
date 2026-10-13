import { env } from "../config/env.js";

/**
 * Middleware for handling 404 (Not Found) routes.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global centralized error handler middleware for Express.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || "Internal Server Error";
  let errors = err.errors || undefined;

  // 1. Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field '${err.path}': ${err.value}`;
  }

  // 2. Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for '${duplicateField}'. Please use a unique value.`;
  }

  // 3. Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // 4. Handle Payload Too Large (e.g. body > 10kb)
  if (err.type === "entity.too.large" || err.status === 413) {
    statusCode = 413;
    message = "Payload too large. Request body exceeds the permitted limit (10kb).";
  }

  // 5. Handle Malformed JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Malformed JSON payload in request body.";
  }

  // Safe logging in development
  if (env.isDevelopment) {
    console.error(`[Error Handler] ${statusCode} - ${message}`);
    if (err.stack && statusCode >= 500) {
      console.error(err.stack);
    }
  }

  // Construct safe response payload
  const errorResponse = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    errorResponse.errors = errors;
  }

  if (env.isDevelopment && err.stack) {
    errorResponse.stack = err.stack;
  }

  return res.status(statusCode).json(errorResponse);
};
