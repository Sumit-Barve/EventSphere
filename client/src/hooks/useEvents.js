import { useContext } from "react";
import { EventContext } from "../context/EventContext";

/**
 * Custom hook to safely consume EventContext across any component.
 * Demonstrates: useContext with boundary validation to avoid undefined access.
 *
 * @returns {object} EventContext value containing events, filters, handlers, and stats
 */
export function useEvents() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }

  return context;
}
