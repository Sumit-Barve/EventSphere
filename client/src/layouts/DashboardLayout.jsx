import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  Shield,
  UserCheck,
  Ticket,
  Menu,
  X,
  Bell,
  ChevronRight,
  LogOut,
  Sliders,
  Building,
  Home
} from "lucide-react";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getRoleFromPath = () => {
    if (location.pathname.includes("/admin")) return { title: "Admin Portal", role: "ADMIN", color: "bg-purple-600", text: "text-purple-600" };
    if (location.pathname.includes("/organizer")) return { title: "Organizer Workspace", role: "ORGANIZER", color: "bg-indigo-600", text: "text-indigo-600" };
    return { title: "Participant Dashboard", role: "PARTICIPANT", color: "bg-emerald-600", text: "text-emerald-600" };
  };

  const currentRole = getRoleFromPath();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span className="font-bold tracking-tight">EventSphere</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Responsive Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              Event<span className="text-indigo-400">Sphere</span>
            </span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Dashboard Role Views Navigation */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
              Role Views (Dev Preview)
            </p>
            <div className="space-y-1">
              <Link
                to="/dashboard/participant"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard/participant"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Participant View</span>
              </Link>
              <Link
                to="/dashboard/organizer"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard/organizer"
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Organizer View</span>
              </Link>
              <Link
                to="/dashboard/admin"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard/admin"
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin View</span>
              </Link>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
              Explore Platform
            </p>
            <div className="space-y-1">
              <Link
                to="/events"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Discover Events
              </Link>
              <Link
                to="/venues"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <Building className="w-4 h-4" /> Venues Directory
              </Link>
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <Home className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <div className={`w-9 h-9 rounded-lg ${currentRole.color} flex items-center justify-center text-white font-bold text-sm shadow-xs`}>
              {currentRole.role[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Demo Account</p>
              <p className={`text-[10px] font-extrabold uppercase ${currentRole.text}`}>{currentRole.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Breadcrumb & Notification Header */}
        <header className="hidden md:flex items-center justify-between h-16 bg-white px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900">EventSphere</Link>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="font-semibold text-slate-900">{currentRole.title}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Role: {currentRole.role}
            </span>
          </div>
        </header>

        {/* Dashboard Sub-Route Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
