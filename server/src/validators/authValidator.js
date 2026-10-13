import { body } from "express-validator";
import { validate } from "./eventValidator.js";

/**
 * Validation rules for POST /api/auth/register
 */
export const registerValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ max: 60 })
    .withMessage("Name cannot exceed 60 characters"),

  body("email")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isString()
    .isIn(["PARTICIPANT", "ORGANIZER"])
    .withMessage("Public registration role must be PARTICIPANT or ORGANIZER (ADMIN accounts cannot be registered publicly)"),

  body("city")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),

  validate,
];

/**
 * Validation rules for POST /api/auth/login
 */
export const loginValidator = [
  body("email")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),

  validate,
];
