import React, { createContext, useState, useEffect, useMemo } from "react";
import { MOCK_EVENTS, MOCK_REGISTRATIONS, MOCK_ADMIN_STATS } from "../data/mockData";

export const EventContext = createContext(null);

/**
 * EventProvider manages platform-wide event state, filters, registrations,
 * and discovery state using React Hooks (useState, useEffect, useMemo).
 */
export function EventProvider({ children }) {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Simulated frontend mount lifecycle: demonstrates useEffect mounting with cleanup safety
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  // Filter events dynamically based on search query and category
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesCategory =
        selectedCategory === "ALL" || evt.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        evt.title.toLowerCase().includes(query) ||
        evt.description.toLowerCase().includes(query) ||
        evt.venue.toLowerCase().includes(query) ||
        (evt.location && evt.location.toLowerCase().includes(query)) ||
        (evt.city && evt.city.toLowerCase().includes(query)) ||
        (Array.isArray(evt.tags) && evt.tags.some((tag) => tag.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [events, searchQuery, selectedCategory]);

  // Admin Actions
  const approveEvent = (eventId) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, approvalStatus: "APPROVED", status: "PUBLISHED" }
          : evt
      )
    );
  };

  const rejectEvent = (eventId) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, approvalStatus: "REJECTED", status: "CANCELLED" }
          : evt
      )
    );
  };

  // Organizer Action: Add new event (India-first defaults)
  const addEvent = (eventData) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: eventData.title,
      category: eventData.category || "Technology",
      city: eventData.city || "Mumbai",
      description: eventData.description || "Exciting upcoming technical conference on EventSphere platform.",
      banner:
        eventData.banner ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      organizer: eventData.organizer || "Mumbai Student Tech Club",
      organizerRole: "ORGANIZER",
      venue: eventData.venue || "VESIT Main Auditorium, Chembur, Mumbai",
      location: eventData.location || "Chembur, Mumbai, Maharashtra",
      date: eventData.date || "25 Nov 2026",
      time: eventData.time || "10:00 AM - 05:00 PM IST",
      capacity: Number(eventData.capacity) || 150,
      registered: 0,
      price: Number(eventData.price) || 0,
      status: "PENDING_APPROVAL",
      approvalStatus: "PENDING",
      tags: eventData.tags || ["Technology", "Mumbai", "2026"],
      featured: false,
    };

    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  // Participant Action: Register for event (India-first format)
  const registerForEvent = (eventId, userData = {}) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return false;

    // Increment registered count if capacity permits
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId && evt.registered < evt.capacity
          ? { ...evt, registered: evt.registered + 1 }
          : evt
      )
    );

    // Create new participant registration ticket record with Indian ticket identifier
    const ticketSuffix = Math.floor(100 + Math.random() * 900);
    const newRegistration = {
      id: `reg-${Date.now()}`,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      eventDate: targetEvent.date,
      venue: targetEvent.venue,
      ticketCode: `ES-MUM-2026-${ticketSuffix}-REG`,
      qrData: `EVENTSPHERE-TICKET-ES-MUM-2026-${ticketSuffix}-${(userData.email || "DEMO").toUpperCase()}`,
      registeredAt: "Today",
      status: "CONFIRMED",
      attendanceStatus: "PENDING",
      certificateEligible: false,
      attendeeName: userData.name || "Aarav Mehta",
      attendeeEmail: userData.email || "aarav.mehta@ves.ac.in",
    };

    setRegistrations((prev) => [newRegistration, ...prev]);
    return newRegistration;
  };

  const isRegistered = (eventId) => {
    return registrations.some((reg) => reg.eventId === eventId);
  };

  const getEventById = (eventId) => {
    return events.find((evt) => evt.id === eventId);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
  };

  // Dynamically computed stats
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const pendingApprovals = events.filter((e) => e.approvalStatus === "PENDING").length;
    const totalRegistrations = registrations.length;
    const publishedEvents = events.filter((e) => e.approvalStatus === "APPROVED").length;

    return {
      ...MOCK_ADMIN_STATS,
      totalEvents,
      pendingApprovals,
      publishedEvents,
      totalAttendees: MOCK_ADMIN_STATS.totalUsers + totalRegistrations,
    };
  }, [events, registrations]);

  const value = {
    events,
    filteredEvents,
    registrations,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    resetFilters,
    isLoading,
    approveEvent,
    rejectEvent,
    addEvent,
    registerForEvent,
    isRegistered,
    getEventById,
    stats,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}
