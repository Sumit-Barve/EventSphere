import React, { createContext, useState, useCallback } from "react";

export const AppContext = createContext(null);

export const DEFAULT_MOCK_USER = {
  id: "org-001",
  name: "Aarav Sharma",
  email: "aarav.sharma@eventsphere.in",
  role: "ORGANIZER",
  city: "Mumbai",
  college: "VESIT Mumbai",
};

/**
 * AppProvider manages application-wide concerns:
 * 1. Active mock user profile (deterministic organizer/user identity)
 * 2. Global notification/toast system (reactive feedback across components)
 */
export function AppProvider({ children }) {
  const [activeUser, setActiveUser] = useState(DEFAULT_MOCK_USER);
  const [toasts, setToasts] = useState([]);

  // Remove toast by id
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Show new reactive toast notification
  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const value = {
    activeUser,
    setActiveUser,
    toasts,
    showToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
