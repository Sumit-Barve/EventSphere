import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Building,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  QrCode
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardBody } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useEvents } from "../hooks/useEvents";

export function HomePage() {
  // Global Context consumption via useEvents custom hook
  const { approvedEvents, stats } = useEvents();

  // Dynamically derive featured approved events from global context
  const featuredEvents = approvedEvents
    .filter((e) => e.status !== "CANCELLED")
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section - India-First Product Messaging */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-20 overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> India&apos;s Smart Event & Venue Ecosystem
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Discover, Organize & Experience <span className="text-indigo-400">Events Across India</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed">
              EventSphere powers colleges, developer communities, and organizers across Mumbai, Pune, Bengaluru & Delhi NCR with seamless registrations, double-booking protected venues, and instant QR entry passes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/events">
                <Button variant="primary" size="lg" className="gap-2">
                  <Search className="w-4 h-4" /> Discover Events
                </Button>
              </Link>
              <Link to="/venues">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700"
                >
                  Explore Partner Venues
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats Connected to Context */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-white p-6 shadow-md border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{stats.totalEvents}+</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Events Listed</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white p-6 shadow-md border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">
                  {stats.totalAttendees.toLocaleString("en-IN")}+
                </p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Attendees</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white p-6 shadow-md border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 font-bold">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{stats.totalVenues}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Partner Venues</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white p-6 shadow-md border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">99.8%</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verified Check-in Rate</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge variant="primary" className="mb-2">FEATURED SELECTION</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming High-Impact Events
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Explore trending technology summits, college hackathons, design workshops, and career bootcamps.
            </p>
          </div>
          <Link to="/events">
            <Button variant="outline" size="sm" className="gap-1.5">
              View All Events <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((evt) => (
            <Card key={evt.id} hoverable className="flex flex-col">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={evt.banner}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="primary">{evt.category}</Badge>
                  {evt.price === 0 && <Badge variant="success">FREE</Badge>}
                </div>
              </div>

              <CardBody className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {evt.date} • {evt.time}
                    </span>
                  </div>

                  <ProgressBar value={evt.registered} max={evt.capacity} />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">
                    {evt.price === 0 ? "Free Entry" : `₹${evt.price.toLocaleString("en-IN")}`}
                  </span>
                  <Link to={`/events/${evt.id}`}>
                    <Button variant="primary" size="sm">View Details</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Ecosystem Pillars Showcase */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Built for Indian Campus & Tech Communities
            </h2>
            <p className="text-slate-400 text-sm">
              EventSphere cleanly separates responsibilities while creating a frictionless workflow between College Admins, Community Organizers, and Student Participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/80 border-slate-700 p-6 space-y-4 text-white">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Admin Control Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Approve or reject college and corporate event listings, prevent double bookings on auditoriums, and monitor state-wide registration metrics.
              </p>
              <Link
                to="/dashboard/admin"
                className="inline-flex text-xs font-semibold text-purple-400 hover:text-purple-300 gap-1 items-center"
              >
                Preview Admin Dashboard →
              </Link>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 p-6 space-y-4 text-white">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Organizer Workspace</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Publish tech summits and cultural fests, reserve campus labs and convention halls, track live seat capacity, and scan QR passes at entry.
              </p>
              <Link
                to="/dashboard/organizer"
                className="inline-flex text-xs font-semibold text-indigo-400 hover:text-indigo-300 gap-1 items-center"
              >
                Preview Organizer Suite →
              </Link>
            </Card>

            <Card className="bg-slate-800/80 border-slate-700 p-6 space-y-4 text-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Participant Experience</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click registration for hackathons and workshops, instant digital passes with unique QR ticket codes, and automatic certificate eligibility.
              </p>
              <Link
                to="/dashboard/participant"
                className="inline-flex text-xs font-semibold text-emerald-400 hover:text-emerald-300 gap-1 items-center"
              >
                Preview Participant View →
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
