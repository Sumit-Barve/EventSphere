import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const TOKEN_KEY = "eventsphere_token";
const USER_KEY = "eventsphere_user";

// Resolve API base URL dynamically with local development fallback
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CLEAN_API_BASE = RAW_API_URL.replace(/\/+$/, "");
const AUTH_API_BASE = CLEAN_API_BASE.endsWith("/api")
  ? `${CLEAN_API_BASE}/auth`
  : `${CLEAN_API_BASE}/api/auth`;

export const DEMO_CREDENTIALS = {
  ADMIN: {
    email: "admin@eventsphere.local",
    password: "Admin@123",
    role: "ADMIN",
    title: "Platform Administrator",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
  ORGANIZER: {
    email: "organizer@eventsphere.local",
    password: "Organizer@123",
    role: "ORGANIZER",
    title: "Event Organizer",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  PARTICIPANT: {
    email: "participant@eventsphere.local",
    password: "Participant@123",
    role: "PARTICIPANT",
    title: "College Participant",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validate existing token with /api/auth/me on initial mount
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${AUTH_API_BASE}/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.user) {
            setUser(data.data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthContext] Verification error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const res = await fetch(`${AUTH_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password");
      }

      const receivedToken = data.data.token;
      const receivedUser = data.data.user;

      localStorage.setItem(TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true, user: receivedUser, token: receivedToken };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  // Register handler
  const register = useCallback(async ({ name, email, password, role = "PARTICIPANT", city = "Mumbai" }) => {
    setAuthError(null);
    try {
      const res = await fetch(`${AUTH_API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, city }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.errors ? data.errors.map((e) => e.message).join(", ") : data.message;
        throw new Error(errorMsg || "Registration failed");
      }

      const receivedToken = data.data.token;
      const receivedUser = data.data.user;

      localStorage.setItem(TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true, user: receivedUser, token: receivedToken };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  // Quick Demo Login for Faculty Demonstration
  const quickLogin = useCallback(
    async (roleKey) => {
      const creds = DEMO_CREDENTIALS[roleKey];
      if (!creds) return { success: false, message: "Invalid demo role" };
      return await login(creds.email, creds.password);
    },
    [login]
  );

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    quickLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
