import { useContext } from "react";
import { AppContext } from "../context/AppContext";

/**
 * Custom hook to consume AppContext safely across any component.
 * Demonstrates: useContext with boundary validation to avoid undefined access.
 *
 * @returns {object} AppContext value containing activeUser, toasts, showToast, removeToast
 */
export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
