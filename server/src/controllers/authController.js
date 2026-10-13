import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

/**
 * Helper to generate JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * @desc    Register a new user (PARTICIPANT or ORGANIZER)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, city } = req.body;

    // Security check: Prevent public creation of ADMIN accounts
    if (role && role.toUpperCase() === "ADMIN") {
      return next(
        new AppError("ADMIN accounts cannot be created through public registration.", 403)
      );
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return next(
        new AppError("A user with this email address already exists. Please log in instead.", 409)
      );
    }

    // Create user in MongoDB
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role ? role.toUpperCase() : "PARTICIPANT",
      city: city || "Mumbai",
    });

    const token = generateToken(user);

    return sendSuccess(
      res,
      201,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          city: user.city,
        },
      },
      "User registered successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login existing user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user including password hash for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const token = generateToken(user);

    return sendSuccess(
      res,
      200,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          city: user.city,
        },
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private (Requires JWT)
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    return sendSuccess(
      res,
      200,
      {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          city: req.user.city,
          createdAt: req.user.createdAt,
        },
      },
      "Current user profile retrieved"
    );
  } catch (error) {
    next(error);
  }
};
