import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Code2, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Event<span className="text-indigo-400">Sphere</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Centralized platform for creating, discovering, organizing, and managing events and venues.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors" title="GitHub Repository">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors" title="Platform Status">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link to="/venues" className="hover:text-white transition-colors">Venues Directory</Link></li>
              <li><Link to="/dashboard/participant" className="hover:text-white transition-colors">Participant Dashboard</Link></li>
              <li><Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizer Portal</Link></li>
            </ul>
          </div>

          {/* Practical & Admin */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Project & Faculty</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><a href="#practical-matrix" className="hover:text-white transition-colors">College Practicals (P1-P10)</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Full Stack Architecture</a></li>
              <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Tech Stack Tags */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Technology Stack</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">React.js</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Vite</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Node.js</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Express</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">MongoDB</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Socket.IO</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">JWT</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EventSphere Platform. Full Stack Development Subject Micro-Project.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
