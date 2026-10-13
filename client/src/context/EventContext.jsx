import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { MOCK_REGISTRATIONS, MOCK_ADMIN_STATS } from "../data/mockData";
import { useApp } from "../hooks/useApp";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";

export const EventContext = createContext(null);

const API_BASE_URL = "http://localhost:5000/api/events";

/**
 * EventProvider manages platform-wide event state, registrations, and lifecycle.
 * Practical 4: Backed by MongoDB + Mongoose REST API at http://localhost:5000/api/events.
 * Practical 6: Authenticated via JWT and role-based permissions.
 * Practical 8: Real-time synchronization via Socket.IO.
 */
export function EventProvider({ children }) {
  const { activeUser, showToast } = useApp();
  const { user: authUser, token } = useAuth();
  const { socket } = useSocket();

  // Core application state
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Fetch events from MongoDB REST API
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("[EventContext API Error]", err);
      setApiError(err.message || "Failed to fetch events from MongoDB REST API.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch events on initial mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // -------------------------------------------------------------
  // REAL-TIME WEBSOCKET SYNCHRONIZATION (Practical 8)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    // 1. New event created by an organizer
    const handleEventCreated = (newEvent) => {
      setEvents((prev) => {
        const exists = prev.some(
          (e) => (e.id && e.id === newEvent.id) || (e._id && e._id === newEvent.id)
        );
        if (exists) return prev;
        return [newEvent, ...prev];
      });
    };

    // 2. Event approved by Admin
    const handleEventApproved = (approvedEvent) => {
      setEvents((prev) =>
        prev.map((e) => {
          const isTarget =
            (e.id && (e.id === approvedEvent.id || e.id === approvedEvent._id)) ||
            (e._id && (e._id === approvedEvent.id || e._id === approvedEvent._id));
          return isTarget
            ? { ...e, ...approvedEvent, approvalStatus: "APPROVED", status: "PUBLISHED" }
            : e;
        })
      );
    };

    // 3. Event rejected by Admin
    const handleEventRejected = (rejectedEvent) => {
      setEvents((prev) =>
        prev.map((e) => {
          const isTarget =
            (e.id && (e.id === rejectedEvent.id || e.id === rejectedEvent._id)) ||
            (e._id && (e._id === rejectedEvent.id || e._id === rejectedEvent._id));
          return isTarget
            ? { ...e, ...rejectedEvent, approvalStatus: "REJECTED", status: "CANCELLED" }
            : e;
        })
      );
    };

    // 4. Event updated
    const handleEventUpdated = (updatedEvent) => {
      setEvents((prev) =>
        prev.map((e) => {
          const isTarget =
            (e.id && (e.id === updatedEvent.id || e.id === updatedEvent._id)) ||
            (e._id && (e._id === updatedEvent.id || e._id === updatedEvent._id));
          return isTarget ? { ...e, ...updatedEvent } : e;
        })
      );
    };

    // 5. Event deleted
    const handleEventDeleted = ({ id }) => {
      setEvents((prev) => prev.filter((e) => e.id !== id && e._id !== id));
    };

    // 6. Real-time participant registration count update
    const handleRegistrationUpdate = (regData) => {
      setEvents((prev) =>
        prev.map((e) => {
          const isTarget =
            (e.id && e.id === regData.eventId) || (e._id && e._id === regData.eventId);
          if (!isTarget) return e;

          const updatedCount =
            regData.registeredCount !== undefined
              ? regData.registeredCount
              : regData.registered !== undefined
              ? regData.registered
              : e.registered + 1;

          return { ...e, registered: updatedCount };
        })
      );
    };

    socket.on("event:created", handleEventCreated);
    socket.on("event:approved", handleEventApproved);
    socket.on("event:rejected", handleEventRejected);
    socket.on("event:updated", handleEventUpdated);
    socket.on("event:deleted", handleEventDeleted);
    socket.on("registration:created", handleRegistrationUpdate);
    socket.on("registration:updated", handleRegistrationUpdate);

    return () => {
      socket.off("event:created", handleEventCreated);
      socket.off("event:approved", handleEventApproved);
      socket.off("event:rejected", handleEventRejected);
      socket.off("event:updated", handleEventUpdated);
      socket.off("event:deleted", handleEventDeleted);
      socket.off("registration:created", handleRegistrationUpdate);
      socket.off("registration:updated", handleRegistrationUpdate);
    };
  }, [socket]);

  // -------------------------------------------------------------
  // DERIVED STATE (Computed via useMemo to avoid duplicate state)
  // -------------------------------------------------------------

  // 1. Approved events (Eligible for public discovery)
  const approvedEvents = useMemo(() => {
    return events.filter((evt) => evt.approvalStatus === "APPROVED");
  }, [events]);

  // 2. Pending events (Awaiting Admin review in queue)
  const pendingEvents = useMemo(() => {
    return events.filter((evt) => evt.approvalStatus === "PENDING");
  }, [events]);

  // 3. Rejected events
  const rejectedEvents = useMemo(() => {
    return events.filter((evt) => evt.approvalStatus === "REJECTED");
  }, [events]);

  // 4. Organizer events (Strictly scoped by logged-in organizer id or fallback)
  const organizerEvents = useMemo(() => {
    const currentOrganizerId = authUser?.id || activeUser?.id || "org-001";
    return events.filter((evt) => evt.organizerId === currentOrganizerId);
  }, [events, authUser, activeUser]);

  // 5. Filtered public events (Dynamic search + category filter over approvedEvents)
  const filteredEvents = useMemo(() => {
    return approvedEvents.filter((evt) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        (evt.category && evt.category.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        (evt.title && evt.title.toLowerCase().includes(query)) ||
        (evt.description && evt.description.toLowerCase().includes(query)) ||
        (evt.venue && evt.venue.toLowerCase().includes(query)) ||
        (evt.location && evt.location.toLowerCase().includes(query)) ||
        (evt.city && evt.city.toLowerCase().includes(query)) ||
        (Array.isArray(evt.tags) && evt.tags.some((tag) => tag.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [approvedEvents, searchQuery, selectedCategory]);

  // 6. Registered events with full event details joined
  const registeredEvents = useMemo(() => {
    return registrations.map((reg) => {
      const eventDetails = events.find(
        (e) => (e.id && e.id === reg.eventId) || (e._id && e._id === reg.eventId)
      );
      return {
        ...reg,
        eventDetails: eventDetails || null,
      };
    });
  }, [registrations, events]);

  // 7. Dynamic aggregate statistics computed from live state
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const publishedEvents = approvedEvents.length;
    const pendingApprovals = pendingEvents.length;
    const rejectedCount = rejectedEvents.length;
    const totalRegistrations = registrations.length;

    // Dynamically calculate total platform revenue from active events
    const dynamicRevenueNum = events.reduce((sum, evt) => {
      const price = Number(evt.price) || 0;
      const attendees = Number(evt.registered) || 0;
      return sum + price * attendees;
    }, 0);

    return {
      ...MOCK_ADMIN_STATS,
      totalEvents,
      publishedEvents,
      pendingApprovals,
      rejectedCount,
      totalRegistrations,
      dynamicRevenue: dynamicRevenueNum,
      platformRevenue: `₹${dynamicRevenueNum.toLocaleString("en-IN")}`,
      totalAttendees: MOCK_ADMIN_STATS.totalUsers + totalRegistrations,
    };
  }, [events, approvedEvents, pendingEvents, rejectedEvents, registrations]);

  // -------------------------------------------------------------
  // ACTIONS / STATE UPDATERS (Async REST API integrations)
  // -------------------------------------------------------------

  // Helper to build headers with Authorization JWT
  const getAuthHeaders = useCallback(() => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  // Admin Action: Approve event (PUT /api/events/:id)
  const approveEvent = useCallback(
    async (eventId) => {
      try {
        const res = await fetch(`${API_BASE_URL}/${eventId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ approvalStatus: "APPROVED", status: "PUBLISHED" }),
        });
        const data = await res.json();
        if (data.success) {
          setEvents((prev) =>
            prev.map((evt) =>
              (evt.id === eventId || evt._id === eventId)
                ? { ...evt, approvalStatus: "APPROVED", status: "PUBLISHED" }
                : evt
            )
          );
          showToast("Event approved and published to public catalog.", "success");
        } else {
          showToast(data.message || "Failed to approve event.", "error");
        }
      } catch (_err) {
        showToast("Network error approving event.", "error");
      }
    },
    [getAuthHeaders, showToast]
  );

  // Admin Action: Reject event (PUT /api/events/:id)
  const rejectEvent = useCallback(
    async (eventId) => {
      try {
        const res = await fetch(`${API_BASE_URL}/${eventId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ approvalStatus: "REJECTED", status: "CANCELLED" }),
        });
        const data = await res.json();
        if (data.success) {
          setEvents((prev) =>
            prev.map((evt) =>
              (evt.id === eventId || evt._id === eventId)
                ? { ...evt, approvalStatus: "REJECTED", status: "CANCELLED" }
                : evt
            )
          );
          showToast("Event listing rejected.", "warning");
        } else {
          showToast(data.message || "Failed to reject event.", "error");
        }
      } catch (_err) {
        showToast("Network error rejecting event.", "error");
      }
    },
    [getAuthHeaders, showToast]
  );

  // Organizer Action: Add new event (POST /api/events)
  const addEvent = useCallback(
    async (eventData) => {
      const currentOrgId = authUser?.id || activeUser?.id || "org-001";
      const currentOrgName = authUser?.name || activeUser?.name || "DevSphere India Organizer";

      const payload = {
        title: eventData.title,
        organizerId: currentOrgId,
        organizer: eventData.organizer || currentOrgName,
        organizerRole: authUser?.role || "ORGANIZER",
        category: eventData.category || "Technology",
        city: eventData.city || authUser?.city || activeUser?.city || "Mumbai",
        description:
          eventData.description ||
          "Exciting upcoming technical conference on EventSphere platform.",
        banner:
          eventData.banner ||
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        venue: eventData.venue || "VESIT Main Auditorium, Chembur, Mumbai",
        location: eventData.location || "Chembur, Mumbai, Maharashtra",
        date: eventData.date || "25 Nov 2026",
        time: eventData.time || "10:00 AM - 05:00 PM IST",
        capacity: Number(eventData.capacity) || 150,
        price: Number(eventData.price) || 0,
        status: "PENDING_APPROVAL",
        approvalStatus: "PENDING",
        tags: eventData.tags || [
          eventData.category || "Technology",
          eventData.city || "Mumbai",
          "2026",
        ],
        featured: false,
      };

      try {
        const res = await fetch(API_BASE_URL, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.data) {
          const created = data.data;
          setEvents((prev) => [created, ...prev]);
          showToast(`"${created.title}" created & queued for approval in MongoDB!`, "success");
          return created;
        } else {
          showToast(data.message || "Failed to create event in MongoDB.", "error");
        }
      } catch (_err) {
        showToast("Network error creating event.", "error");
      }
    },
    [authUser, activeUser, getAuthHeaders, showToast]
  );

  // Update existing event fields (PUT /api/events/:id)
  const updateEvent = useCallback(
    async (eventId, updatedFields) => {
      try {
        const res = await fetch(`${API_BASE_URL}/${eventId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedFields),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setEvents((prev) =>
            prev.map((evt) =>
              (evt.id === eventId || evt._id === eventId) ? data.data : evt
            )
          );
          showToast("Event details updated in MongoDB.", "success");
        } else {
          showToast(data.message || "Failed to update event.", "error");
        }
      } catch (_err) {
        showToast("Network error updating event.", "error");
      }
    },
    [getAuthHeaders, showToast]
  );

  // Delete event (DELETE /api/events/:id)
  const deleteEvent = useCallback(
    async (eventId) => {
      try {
        const res = await fetch(`${API_BASE_URL}/${eventId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          setEvents((prev) =>
            prev.filter((evt) => evt.id !== eventId && evt._id !== eventId)
          );
          setRegistrations((prev) =>
            prev.filter((reg) => reg.eventId !== eventId)
          );
          showToast("Event deleted from MongoDB.", "info");
        } else {
          showToast(data.message || "Failed to delete event.", "error");
        }
      } catch (_err) {
        showToast("Network error deleting event.", "error");
      }
    },
    [getAuthHeaders, showToast]
  );

  // Participant Action: Register for event with safety validations
  const registerForEvent = useCallback(
    (eventId, userData = {}) => {
      const targetEvent = events.find(
        (e) => (e.id && e.id === eventId) || (e._id && e._id === eventId)
      );

      // 1. Check event existence
      if (!targetEvent) {
        showToast("Event not found.", "error");
        return { success: false, message: "Event not found." };
      }

      // 2. Check event capacity
      if (targetEvent.registered >= targetEvent.capacity) {
        showToast("Event is already fully booked!", "warning");
        return { success: false, message: "Event capacity reached." };
      }

      const attendeeEmail = (
        userData.email ||
        activeUser?.email ||
        "aarav.mehta@ves.ac.in"
      )
        .trim()
        .toLowerCase();

      // 3. Prevent duplicate registration
      const alreadyRegistered = registrations.some(
        (reg) =>
          reg.eventId === (targetEvent.id || targetEvent._id) &&
          reg.attendeeEmail.trim().toLowerCase() === attendeeEmail
      );

      if (alreadyRegistered) {
        showToast("You are already registered for this event.", "warning");
        return { success: false, message: "Already registered." };
      }

      // 4. Safely increment registered seat count immutably
      setEvents((prev) =>
        prev.map((evt) =>
          (evt.id === eventId || evt._id === eventId) && evt.registered < evt.capacity
            ? { ...evt, registered: evt.registered + 1 }
            : evt
        )
      );

      // Trigger backend MongoDB registration update & WebSocket emission asynchronously
      const targetEventId = targetEvent.id || targetEvent._id;
      fetch(`${API_BASE_URL}/${targetEventId}/register`, {
        method: "POST",
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            console.warn("[Event Registration API Notice]", data.message);
          }
        })
        .catch((err) => {
          console.error("[Event Registration API Error]", err);
        });

      // 5. Create new participant registration ticket record
      const ticketSuffix = Math.floor(100 + Math.random() * 900);
      const newRegistration = {
        id: `reg-${Date.now()}`,
        eventId: targetEvent.id || targetEvent._id,
        eventTitle: targetEvent.title,
        eventDate: targetEvent.date,
        venue: targetEvent.venue,
        ticketCode: `ES-MUM-2026-${ticketSuffix}-REG`,
        qrData: `EVENTSPHERE-TICKET-ES-MUM-2026-${ticketSuffix}-${attendeeEmail.toUpperCase()}`,
        registeredAt: "Today",
        status: "CONFIRMED",
        attendanceStatus: "PENDING",
        certificateEligible: false,
        attendeeName: userData.name || activeUser?.name || "Aarav Mehta",
        attendeeEmail: attendeeEmail,
      };

      setRegistrations((prev) => [newRegistration, ...prev]);
      showToast(`Pass confirmed for "${targetEvent.title}"!`, "success");

      return { success: true, registration: newRegistration };
    },
    [events, registrations, activeUser, showToast]
  );

  // Participant Action: Cancel registration
  const cancelRegistration = useCallback(
    (registrationId) => {
      const targetReg = registrations.find((r) => r.id === registrationId);
      if (!targetReg) {
        showToast("Registration record not found.", "error");
        return false;
      }

      // Decrease corresponding event registered count safely (never below 0)
      setEvents((prev) =>
        prev.map((evt) =>
          (evt.id === targetReg.eventId || evt._id === targetReg.eventId)
            ? { ...evt, registered: Math.max(0, evt.registered - 1) }
            : evt
        )
      );

      // Remove registration pass immutably
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
      showToast(`Registration for "${targetReg.eventTitle}" cancelled.`, "info");
      return true;
    },
    [registrations, showToast]
  );

  // Helper: Check if specific event is registered for current user
  const isRegistered = useCallback(
    (eventId, userEmail) => {
      const emailToCheck = (
        userEmail ||
        activeUser?.email ||
        "aarav.mehta@ves.ac.in"
      )
        .trim()
        .toLowerCase();

      return registrations.some(
        (reg) =>
          (reg.eventId === eventId) &&
          reg.attendeeEmail.trim().toLowerCase() === emailToCheck
      );
    },
    [registrations, activeUser]
  );

  // Helper: Retrieve single event by id
  const getEventById = useCallback(
    (eventId) => {
      return events.find((evt) => evt.id === eventId || evt._id === eventId);
    },
    [events]
  );

  // Helper: Reset search & category filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("ALL");
  }, []);

  const value = {
    // Raw state
    events,
    registrations,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    resetFilters,
    isLoading,
    apiError,
    fetchEvents,

    // Derived state
    approvedEvents,
    pendingEvents,
    rejectedEvents,
    organizerEvents,
    filteredEvents,
    registeredEvents,
    stats,

    // Actions
    approveEvent,
    rejectEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    isRegistered,
    getEventById,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}
