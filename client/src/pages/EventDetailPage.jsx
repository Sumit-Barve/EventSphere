import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  ArrowLeft
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Modal } from "../components/ui/Modal";
import { useEvents } from "../hooks/useEvents";

export function EventDetailPage() {
  const { id } = useParams();
  const { events, getEventById, registerForEvent, isRegistered } = useEvents();

  // Local state for modal & registration form inputs (useState)
  const [modalOpen, setModalOpen] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [participantName, setParticipantName] = useState("Aarav Mehta");
  const [participantEmail, setParticipantEmail] = useState("aarav.mehta@ves.ac.in");

  // Retrieve event from global context
  const event = getEventById(id) || events[0];
  const alreadyRegistered = event ? isRegistered(event.id, participantEmail) : false;
  const isSoldOut = event ? event.registered >= event.capacity : false;

  const handleRegisterConfirm = () => {
    if (event) {
      const result = registerForEvent(event.id, { name: participantName, email: participantEmail });
      if (result && result.success) {
        setRegisteredSuccess(true);
      }
    }
  };

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <Link to="/events">
          <Button variant="primary">Back to Discover Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Event Discovery
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
        <div className="h-64 sm:h-96 relative">
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{event.category}</Badge>
            <Badge variant={event.approvalStatus === "APPROVED" ? "success" : "warning"}>
              {event.approvalStatus}
            </Badge>
            {event.price === 0 && <Badge variant="warning">FREE ENTRY</Badge>}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" /> {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" /> {event.venue}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details vs Sidebar CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">About This Event</h2>
            </CardHeader>
            <CardBody className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>{event.description}</p>
              <p className="text-xs text-slate-500 font-medium">
                Location: {event.location || event.venue}
              </p>
              {Array.isArray(event.tags) && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Agenda Timeline in IST */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">Event Schedule Timeline (IST)</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
                <p className="text-xs font-bold text-indigo-600">09:30 AM - 10:15 AM IST</p>
                <h4 className="text-sm font-bold text-slate-900">Keynote & Welcome Address</h4>
                <p className="text-xs text-slate-500">Opening remarks by lead organizers and industry visionaries.</p>
              </div>
              <div className="border-l-2 border-slate-300 pl-4 space-y-1">
                <p className="text-xs font-bold text-slate-500">10:30 AM - 01:30 PM IST</p>
                <h4 className="text-sm font-bold text-slate-900">Technical Sessions & Hands-on Architecture</h4>
                <p className="text-xs text-slate-500">Deep-dive live coding, scalable patterns, and interactive Q&A discussions.</p>
              </div>
              <div className="border-l-2 border-slate-300 pl-4 space-y-1">
                <p className="text-xs font-bold text-slate-500">02:30 PM - 05:30 PM IST</p>
                <h4 className="text-sm font-bold text-slate-900">Networking & Certificate Distribution</h4>
                <p className="text-xs text-slate-500">Connect with participants and download digital attendance verification.</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar Ticket Action Card */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-indigo-100 shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Pass Price</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {event.price === 0 ? "FREE" : `₹${event.price.toLocaleString("en-IN")}`}
                </span>
              </div>
            </CardHeader>

            <CardBody className="space-y-6">
              <ProgressBar value={event.registered} max={event.capacity} />

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant Ticket Generation & QR Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Digital Attendance Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Organized by {event.organizer}</span>
                </div>
              </div>

              {alreadyRegistered ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You are registered for this event!
                  </div>
                  <Link to="/dashboard/participant" className="block">
                    <Button variant="emerald" size="lg" className="w-full gap-2 shadow-md">
                      <Ticket className="w-5 h-5" /> View Ticket in Dashboard
                    </Button>
                  </Link>
                </div>
              ) : isSoldOut ? (
                <Button variant="ghost" size="lg" disabled className="w-full bg-slate-100 text-slate-400 cursor-not-allowed">
                  Event Full (Sold Out)
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 shadow-md"
                  onClick={() => {
                    setRegisteredSuccess(false);
                    setModalOpen(true);
                  }}
                >
                  <Ticket className="w-5 h-5" /> Register Now
                </Button>
              )}

              <p className="text-[11px] text-center text-slate-400 italic">
                EventSphere: Smart ticket generation with instant QR entry pass.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setRegisteredSuccess(false);
        }}
        title="Event Pass Registration"
      >
        {!registeredSuccess ? (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800 space-y-1">
              <p className="font-bold">{event.title}</p>
              <p>
                {event.date} • {event.venue}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="emerald" onClick={handleRegisterConfirm}>
                Confirm Registration ({event.price === 0 ? "Free" : `₹${event.price}`})
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Registration Confirmed!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your digital entry pass has been generated and added to your <strong>Participant Dashboard</strong>.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <Link to="/dashboard/participant">
                <Button variant="primary" size="sm">
                  Go to Participant Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
