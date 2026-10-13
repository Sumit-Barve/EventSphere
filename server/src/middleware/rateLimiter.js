import rateLimit from "express-rate-limit";

/**
 * General API rate limiter: 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Stricter mutation limiter: 30 mutation requests per 15 minutes per IP (POST, PUT, DELETE)
 */
export const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 mutations per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many event creation or modification requests. Please slow down.",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});
