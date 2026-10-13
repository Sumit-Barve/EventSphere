import mongoose from "mongoose";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  emitToUser,
  emitToRole,
  broadcastEvent,
  emitNotificationToUser,
  emitNotificationToRole,
} from "../sockets/socketServer.js";
import {
  sendRegistrationConfirmationEmail,
  sendEventSubmissionEmail,
  sendEventApprovalEmail,
  sendEventRejectionEmail,
} from "../services/emailService.js";

/**
 * @desc    Get all events with optional filtering & search
 * @route   GET /api/events
 * @access  Public
 */
export const getEvents = async (req, res, next) => {
  try {
    const { category, city, approvalStatus, search, featured } = req.query;
    const filter = {};

    if (category && category !== "ALL") {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (city && city !== "ALL") {
      filter.city = new RegExp(`^${city}$`, "i");
    }

    if (approvalStatus) {
      filter.approvalStatus = approvalStatus.toUpperCase();
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { venue: searchRegex },
        { location: searchRegex },
        { city: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });

    return sendSuccess(res, 200, events, null, { count: events.length });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid Event ID format: ${id}`, 400));
    }

    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError(`Event not found with ID: ${id}`, 404));
    }

    return sendSuccess(res, 200, event);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Protected (ORGANIZER, ADMIN)
 */
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      organizer,
      category,
      city,
      description,
      banner,
      venue,
      location,
      date,
      time,
      capacity,
      price,
      tags,
      featured,
      approvalStatus,
      status,
    } = req.body;

    // Associate organizerId strictly with authenticated user
    const authenticatedOrgId = req.user?.id || req.user?._id?.toString() || "org-001";
    const authenticatedOrgName = req.user?.name || organizer || "DevSphere India Community";
    const authenticatedOrgRole = req.user?.role || "ORGANIZER";

    const newEvent = await Event.create({
      title,
      organizer: authenticatedOrgName,
      organizerId: authenticatedOrgId,
      organizerRole: authenticatedOrgRole === "ADMIN" ? "ADMIN" : "ORGANIZER",
      category: category || "Technology",
      city: city || "Mumbai",
      description,
      banner,
      venue,
      location: location || "",
      date,
      time: time || "10:00 AM - 05:00 PM IST",
      capacity: Number(capacity) || 100,
      price: Number(price) || 0,
      registered: 0,
      status: status || "PENDING_APPROVAL",
      approvalStatus: approvalStatus || "PENDING",
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [],
      featured: Boolean(featured),
    });

    // Real-time WebSocket emission to ADMIN role room
    emitToRole("ADMIN", "event:created", {
      id: newEvent.id,
      title: newEvent.title,
      category: newEvent.category,
      city: newEvent.city,
      status: newEvent.status,
      approvalStatus: newEvent.approvalStatus,
      organizer: newEvent.organizer,
      organizerId: newEvent.organizerId,
      createdAt: newEvent.createdAt,
    });

    emitNotificationToRole("ADMIN", {
      type: "EVENT_CREATED",
      title: "New event submitted",
      message: `"${newEvent.title}" was submitted for approval`,
      eventId: newEvent.id,
    });

    // Real email notification to organizer (non-blocking)
    if (req.user && req.user.email) {
      sendEventSubmissionEmail({
        organizer: req.user,
        event: newEvent,
      }).catch((err) => {
        console.error(`[Email Service Error] Failed to send submission email: ${err.message}`);
      });
    }

    return sendSuccess(res, 201, newEvent, "Event created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing event by ID
 * @route   PUT /api/events/:id
 * @access  Protected (ORGANIZER [Owner only], ADMIN [Global])
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid Event ID format: ${id}`, 400));
    }

    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError(`Event not found with ID: ${id}`, 404));
    }

    // Check organizer ownership
    const isOwner =
      req.user &&
      (event.organizerId === req.user.id || event.organizerId === req.user._id?.toString());
    const isAdmin = req.user && req.user.role === "ADMIN";

    if (req.user && !isAdmin && !isOwner) {
      return next(
        new AppError("Forbidden: You do not have permission to modify events created by another organizer.", 403)
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Real-time WebSocket emissions based on approval status change
    if (updatedEvent.approvalStatus === "APPROVED") {
      emitToUser(updatedEvent.organizerId, "event:approved", updatedEvent);
      emitNotificationToUser(updatedEvent.organizerId, {
        type: "EVENT_APPROVED",
        title: "Event approved",
        message: `Your event "${updatedEvent.title}" has been approved.`,
        eventId: updatedEvent.id,
      });
      broadcastEvent("event:approved", updatedEvent);

      // Real email notification to organizer (non-blocking)
      (async () => {
        try {
          let organizerUser = null;
          if (mongoose.Types.ObjectId.isValid(updatedEvent.organizerId)) {
            organizerUser = await User.findById(updatedEvent.organizerId);
          }
          if (!organizerUser) {
            organizerUser = await User.findOne({
              $or: [{ id: updatedEvent.organizerId }, { email: updatedEvent.organizerId }],
            });
          }
          if (organizerUser && organizerUser.email) {
            await sendEventApprovalEmail({
              organizer: organizerUser,
              event: updatedEvent,
            });
          }
        } catch (emailErr) {
          console.error(`[Email Service Error] Failed to dispatch approval email: ${emailErr.message}`);
        }
      })();
    } else if (updatedEvent.approvalStatus === "REJECTED") {
      emitToUser(updatedEvent.organizerId, "event:rejected", updatedEvent);
      emitNotificationToUser(updatedEvent.organizerId, {
        type: "EVENT_REJECTED",
        title: "Event rejected",
        message: `Your event "${updatedEvent.title}" was rejected.`,
        eventId: updatedEvent.id,
      });
      broadcastEvent("event:rejected", updatedEvent);

      // Real email notification to organizer (non-blocking)
      (async () => {
        try {
          let organizerUser = null;
          if (mongoose.Types.ObjectId.isValid(updatedEvent.organizerId)) {
            organizerUser = await User.findById(updatedEvent.organizerId);
          }
          if (!organizerUser) {
            organizerUser = await User.findOne({
              $or: [{ id: updatedEvent.organizerId }, { email: updatedEvent.organizerId }],
            });
          }
          if (organizerUser && organizerUser.email) {
            await sendEventRejectionEmail({
              organizer: organizerUser,
              event: updatedEvent,
              reason: req.body.reason || req.body.rejectionReason,
            });
          }
        } catch (emailErr) {
          console.error(`[Email Service Error] Failed to dispatch rejection email: ${emailErr.message}`);
        }
      })();
    } else {
      broadcastEvent("event:updated", updatedEvent);
    }

    return sendSuccess(res, 200, updatedEvent, "Event updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete event by ID
 * @route   DELETE /api/events/:id
 * @access  Protected (ORGANIZER [Owner only], ADMIN [Global])
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid Event ID format: ${id}`, 400));
    }

    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError(`Event not found with ID: ${id}`, 404));
    }

    // Check organizer ownership
    const isOwner =
      req.user &&
      (event.organizerId === req.user.id || event.organizerId === req.user._id?.toString());
    const isAdmin = req.user && req.user.role === "ADMIN";

    if (req.user && !isAdmin && !isOwner) {
      return next(
        new AppError("Forbidden: You do not have permission to delete events created by another organizer.", 403)
      );
    }

    await Event.findByIdAndDelete(id);

    // Real-time broadcast for event deletion
    broadcastEvent("event:deleted", { id: event.id, title: event.title });

    return sendSuccess(res, 200, { id: event.id }, `Event '${event.title}' deleted successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register participant for an event
 * @route   POST /api/events/:id/register
 * @access  Protected (PARTICIPANT, ORGANIZER, ADMIN)
 */
export const registerForEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid Event ID format: ${id}`, 400));
    }

    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError(`Event not found with ID: ${id}`, 404));
    }

    if (event.registered >= event.capacity) {
      return next(new AppError("Event capacity reached. No more seats available.", 400));
    }

    // Increment registered seat count
    event.registered += 1;
    await event.save();

    const participantId = req.user?.id || req.user?._id?.toString() || "part-user";
    const participantName = req.user?.name || "Participant";

    // Real-time WebSocket emission to event's organizer room
    emitToUser(event.organizerId, "registration:created", {
      eventId: event.id,
      eventTitle: event.title,
      participantId: participantId,
      participantName: participantName,
      registeredCount: event.registered,
      capacity: event.capacity,
      timestamp: new Date().toISOString(),
    });

    emitNotificationToUser(event.organizerId, {
      type: "NEW_REGISTRATION",
      title: "New participant registration",
      message: `${participantName} registered for "${event.title}".`,
      eventId: event.id,
    });

    // Broadcast updated capacity count across platform
    broadcastEvent("registration:updated", {
      eventId: event.id,
      registered: event.registered,
      capacity: event.capacity,
    });

    // Real email confirmation to authenticated participant (non-blocking)
    if (req.user && req.user.email) {
      sendRegistrationConfirmationEmail({
        participant: req.user,
        event: event,
      }).catch((err) => {
        console.error(`[Email Service Error] Failed to send registration confirmation email: ${err.message}`);
      });
    }

    return sendSuccess(
      res,
      200,
      {
        eventId: event.id,
        eventTitle: event.title,
        registered: event.registered,
        capacity: event.capacity,
      },
      "Registration completed successfully"
    );
  } catch (error) {
    next(error);
  }
};

