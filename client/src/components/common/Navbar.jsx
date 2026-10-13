import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Menu,
  X,
  Shield,
  UserCheck,
  Ticket,
  LogOut,
  LogIn,
  User,
  Sparkles,
  Radio,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useApp } from "../../hooks/useApp";
import { useSocket } from "../../hooks/useSocket";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useApp();
  const { isConnected, connectionStatus, socketId } = useSocket();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    showToast("Signed out successfully.", "info");
    navigate("/");
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "ADMIN",
          bg: "bg-purple-100 text-purple-700 border-purple-200",
          icon: Shield,
          dashboard: "/dashboard/admin",
        };
      case "ORGANIZER":
        return {
          label: "ORGANIZER",
          bg: "bg-indigo-100 text-indigo-700 border-indigo-200",
          icon: UserCheck,
          dashboard: "/dashboard/organizer",
        };
      default:
        return {
          label: "PARTICIPANT",
          bg: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: Ticket,
          dashboard: "/dashboard/participant",
        };
    }
  };

  const roleInfo = user ? getRoleBadge(user.role) : null;
  const RoleIcon = roleInfo ? roleInfo.icon : null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Event<span className="text-indigo-600">Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/") ? "bg-slate-100 text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/events") ? "bg-slate-100 text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Discover Events
            </Link>
            <Link
              to="/venues"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/venues") ? "bg-slate-100 text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Venues
            </Link>

            {/* Dev Dashboard Preview Links */}
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-1">
              <Link
                to="/dashboard/participant"
                title="Participant View"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isActive("/dashboard/participant")
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Ticket className="w-3.5 h-3.5" /> Participant
              </Link>
              <Link
                to="/dashboard/organizer"
                title="Organizer View"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isActive("/dashboard/organizer")
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Organizer
              </Link>
              <Link
                to="/dashboard/admin"
                title="Admin View"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isActive("/dashboard/admin")
                    ? "border-purple-300 bg-purple-50 text-purple-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            </div>
          </nav>

          {/* Authentic Auth CTAs / User Badge & Realtime Status */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {/* Real-time Socket Indicator */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-50 border-slate-200 shadow-2xs"
                  title={
                    isConnected
                      ? `Real-time WebSocket Live (${socketId || "Active"})`
                      : connectionStatus === "connecting"
                      ? "Connecting to real-time server..."
                      : "Real-time Offline"
                  }
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected
                        ? "bg-emerald-500 animate-pulse"
                        : connectionStatus === "connecting"
                        ? "bg-amber-500 animate-ping"
                        : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold tracking-tight ${
                      isConnected
                        ? "text-emerald-700"
                        : connectionStatus === "connecting"
                        ? "text-amber-700"
                        : "text-slate-400"
                    }`}
                  >
                    {isConnected ? "LIVE" : connectionStatus === "connecting" ? "SYNCING" : "OFFLINE"}
                  </span>
                </div>

                <Link
                  to={roleInfo?.dashboard || "/dashboard/participant"}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/50 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 leading-none">{user.name.split(" ")[0]}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${roleInfo?.bg}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Quick Demo
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Discover Events
          </Link>
          <Link
            to="/venues"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Venues
          </Link>
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Dashboard Views</p>
            <Link
              to="/dashboard/participant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-emerald-50"
            >
              <Ticket className="w-4 h-4 text-emerald-600" /> Participant View
            </Link>
            <Link
              to="/dashboard/organizer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50"
            >
              <UserCheck className="w-4 h-4 text-indigo-600" /> Organizer View
            </Link>
            <Link
              to="/dashboard/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-purple-50"
            >
              <Shield className="w-4 h-4 text-purple-600" /> Admin View
            </Link>
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Logged in as:</p>
                  <p className="text-sm font-bold text-slate-900">{user.name} ({user.role})</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In / Switch Role</Button>
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Demo Credentials</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
