import { useState, useEffect } from "react";

/**
 * Custom hook for reading and persisting state in window.localStorage.
 * Demonstrates: useState (lazy initializer), useEffect (storage synchronization),
 * and defensive JSON error handling.
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The fallback initial value if no stored value exists
 * @returns {[*, Function]} Stored value and state updater function
 */
export function useLocalStorage(key, initialValue) {
  // Read existing value from localStorage or fallback to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
