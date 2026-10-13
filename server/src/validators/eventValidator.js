import { body, param, validationResult } from "express-validator";

const ALLOWED_CATEGORIES = [
  "Technology",
  "Design",
  "Hackathons",
  "Career",
  "Startups",
  "Cybersecurity",
  "Cloud & DevOps",
  "Cultural",
  "Sports",
  "Other",
];

const ALLOWED_STATUSES = ["PUBLISHED", "PENDING_APPROVAL", "CANCELLED", "DRAFT"];
const ALLOWED_APPROVAL_STATUSES = ["PENDING", "APPROVED", "REJECTED"];
const ALLOWED_ORGANIZER_ROLES = ["ORGANIZER", "VERIFIED ORGANIZER", "ADMIN"];

/**
 * Middleware to check validation results and return formatted errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  next();
};

/**
 * Validation rules for Event ID route parameter
 */
export const eventIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Event ID format. Must be a 24-character hexadecimal MongoDB ObjectId."),
  validate,
];

/**
 * Validation rules for POST /api/events
 */
export const createEventValidator = [
  body("title")
    .isString()
    .withMessage("Event title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Event title is required")
    .isLength({ max: 120 })
    .withMessage("Event title cannot exceed 120 characters"),

  body("organizer")
    .optional()
    .isString()
    .withMessage("Organizer name must be a string")
    .trim(),

  body("organizerRole")
    .optional()
    .isString()
    .isIn(ALLOWED_ORGANIZER_ROLES)
    .withMessage(`Organizer role must be one of: ${ALLOWED_ORGANIZER_ROLES.join(", ")}`),

  body("category")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(ALLOWED_CATEGORIES)
    .withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`),

  body("city")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),

  body("description")
    .isString()
    .withMessage("Event description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Event description is required"),

  body("venue")
    .isString()
    .withMessage("Venue name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Venue name is required"),

  body("location")
    .optional()
    .isString()
    .trim(),

  body("date")
    .isString()
    .withMessage("Event date must be a string")
    .trim()
    .notEmpty()
    .withMessage("Event date is required"),

  body("time")
    .optional()
    .trim(),

  body("capacity")
    .notEmpty()
    .withMessage("Seat capacity is required")
    .isInt({ min: 1 })
    .withMessage("Seat capacity must be an integer of at least 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number (0 for free)"),

  body("registered")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Registered attendees count must be a non-negative integer"),

  body("status")
    .optional()
    .isIn(ALLOWED_STATUSES)
    .withMessage(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}`),

  body("approvalStatus")
    .optional()
    .isIn(ALLOWED_APPROVAL_STATUSES)
    .withMessage(`Approval status must be one of: ${ALLOWED_APPROVAL_STATUSES.join(", ")}`),

  body("tags")
    .optional()
    .custom((val) => {
      if (Array.isArray(val) || typeof val === "string") return true;
      throw new Error("Tags must be an array of strings or comma-separated string");
    }),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured flag must be a boolean (true or false)"),

  validate,
];

/**
 * Validation rules for PUT /api/events/:id
 */
export const updateEventValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Event ID format. Must be a 24-character hexadecimal MongoDB ObjectId."),

  body("title")
    .optional()
    .isString()
    .withMessage("Event title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Event title cannot be empty")
    .isLength({ max: 120 })
    .withMessage("Event title cannot exceed 120 characters"),

  body("organizer")
    .optional()
    .isString()
    .withMessage("Organizer name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Organizer name cannot be empty"),

  body("organizerRole")
    .optional()
    .isString()
    .isIn(ALLOWED_ORGANIZER_ROLES)
    .withMessage(`Organizer role must be one of: ${ALLOWED_ORGANIZER_ROLES.join(", ")}`),

  body("category")
    .optional()
    .isString()
    .trim()
    .isIn(ALLOWED_CATEGORIES)
    .withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`),

  body("city")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),

  body("description")
    .optional()
    .isString()
    .withMessage("Event description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Event description cannot be empty"),

  body("venue")
    .optional()
    .isString()
    .withMessage("Venue name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Venue cannot be empty"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Seat capacity must be an integer of at least 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("registered")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Registered attendees count must be a non-negative integer"),

  body("status")
    .optional()
    .isIn(ALLOWED_STATUSES)
    .withMessage(`Status must be one of: ${ALLOWED_STATUSES.join(", ")}`),

  body("approvalStatus")
    .optional()
    .isIn(ALLOWED_APPROVAL_STATUSES)
    .withMessage(`Approval status must be one of: ${ALLOWED_APPROVAL_STATUSES.join(", ")}`),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured flag must be a boolean (true or false)"),

  validate,
];
