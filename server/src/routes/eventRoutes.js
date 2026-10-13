import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} from "../controllers/eventController.js";
import {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
} from "../validators/eventValidator.js";
import { mutationLimiter } from "../middleware/rateLimiter.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Discovery: GET all events
// Protected Creation: POST event requires valid JWT + ORGANIZER or ADMIN role
router.route("/")
  .get(getEvents)
  .post(
    authenticate,
    authorize("ADMIN", "ORGANIZER"),
    mutationLimiter,
    createEventValidator,
    createEvent
  );

// Public Details: GET event by ID
// Protected Mutation: PUT / DELETE requires valid JWT + ORGANIZER (owner) or ADMIN
router.route("/:id")
  .get(eventIdValidator, getEventById)
  .put(
    authenticate,
    authorize("ADMIN", "ORGANIZER"),
    mutationLimiter,
    updateEventValidator,
    updateEvent
  )
  .delete(
    authenticate,
    authorize("ADMIN", "ORGANIZER"),
    mutationLimiter,
    eventIdValidator,
    deleteEvent
  );

// Protected Registration: POST /api/events/:id/register (any authenticated user)
router.post(
  "/:id/register",
  authenticate,
  mutationLimiter,
  eventIdValidator,
  registerForEvent
);

export default router;
