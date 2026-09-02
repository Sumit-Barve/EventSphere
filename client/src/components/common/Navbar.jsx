import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Menu, X, Shield, UserCheck, Ticket } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
                title="Participant View Preview"
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
                title="Organizer View Preview"
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
                title="Admin View Preview"
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

          {/* Authentic Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button variant="primary" size="sm">Get Started</Button>
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
            <Button variant="outline" className="w-full">Sign In</Button>
            <Button variant="primary" className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
}
