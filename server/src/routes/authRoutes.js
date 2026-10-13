import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/authValidator.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { mutationLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", mutationLimiter, registerValidator, register);
router.post("/login", mutationLimiter, loginValidator, login);
router.get("/me", authenticate, getCurrentUser);

export default router;
