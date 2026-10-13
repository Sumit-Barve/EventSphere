import React, { useState } from "react";
import { Plus, Calendar, MapPin, CheckCircle2, UserCheck, Sparkles } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Modal } from "../../components/ui/Modal";
import { useEvents } from "../../hooks/useEvents";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";

export function OrganizerDashboard() {
  // Global Context consumption via custom hooks
  const { organizerEvents, addEvent, registrations } = useEvents();
  const { activeUser } = useApp();
  const { user, isAuthenticated, quickLogin } = useAuth();

  // Local state for modal open/close and form handling (useState)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Form input state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [capacity, setCapacity] = useState(150);
  const [venue, setVenue] = useState("VESIT Main Auditorium & Seminar Complex, Chembur");
  const [city, setCity] = useState("Mumbai");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addEvent({
      title,
      category,
      city,
      capacity: Number(capacity),
      venue,
      price: Number(price),
      description: description || "Organizer hosted summit on EventSphere India platform.",
      date: "25 Nov 2026",
      time: "10:00 AM - 05:00 PM IST",
      organizer: user?.name || activeUser?.name || "DevSphere India Community",
      tags: [category, city, "2026"],
    });
    setCreatedSuccess(true);
  };

  const handleResetModal = () => {
    setCreateModalOpen(false);
    setCreatedSuccess(false);
    setTitle("");
    setDescription("");
  };

  // Dynamically derive recent registrations for events belonging to this organizer
  const organizerRegistrations = registrations.filter((reg) =>
    organizerEvents.some((evt) => evt.id === reg.eventId)
  );

  return (
    <div className="space-y-6">
      {/* Active Session Warning Banner if not logged in as ORGANIZER/ADMIN */}
      {(!isAuthenticated || (user?.role !== "ORGANIZER" && user?.role !== "ADMIN")) && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-950">Organizer Session Required to Publish & Manage Events</p>
              <p className="text-xs text-indigo-800">
                You are currently in unauthenticated preview mode (offline). Sign in as <span className="font-mono font-bold">ORGANIZER</span> to bind events to your account and receive real-time updates.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap text-xs shadow-xs"
            onClick={() => quickLogin("ORGANIZER")}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> 1-Click Login as Organizer
          </Button>
        </div>
      )}

      {/* Header with Active Organizer Profile Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Organizer Workspace (India)</h1>
            <Badge variant="primary">ID: {user?.id || activeUser?.id || "org-001"}</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Managing events as <strong>{activeUser?.name || "Aarav Sharma"}</strong> ({activeUser?.email || "aarav.sharma@eventsphere.in"}) • {activeUser?.college || "VESIT Mumbai"}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="gap-2 shadow-sm"
          onClick={() => {
            setCreatedSuccess(false);
            setCreateModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Create New Event
        </Button>
      </div>

      {/* Capacity Utilization Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            My Managed Events ({organizerEvents.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">Derived strictly from activeUser.id</span>
        </div>

        {organizerEvents.length === 0 ? (
          <Card className="p-8 text-center space-y-3">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No events found for this organizer</p>
            <p className="text-xs text-slate-500">Create your first event to submit it for Admin review.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizerEvents.map((evt) => (
              <Card key={evt.id} className="p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{evt.category}</Badge>
                    <Badge
                      variant={
                        evt.approvalStatus === "APPROVED"
                          ? "success"
                          : evt.approvalStatus === "PENDING"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {evt.approvalStatus}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {evt.venue}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <ProgressBar value={evt.registered} max={evt.capacity} />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">{evt.price === 0 ? "Free Entry" : `₹${evt.price}`}</span>
                    <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {evt.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Live Registered Attendees List */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Registered Delegates & Students</h2>
            <p className="text-xs text-slate-500">Synchronized across EventSphere global registration state.</p>
          </div>
          <Badge variant="default">{organizerRegistrations.length} Total Attendees</Badge>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          {organizerRegistrations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No participant registrations recorded yet for your events.
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-4">Participant Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Ticket Pass Code</th>
                  <th className="p-4">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizerRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{reg.attendeeName}</td>
                    <td className="p-4 text-slate-500">{reg.attendeeEmail}</td>
                    <td className="p-4 font-medium text-slate-800">{reg.eventTitle}</td>
                    <td className="p-4 font-mono text-indigo-600 font-bold">{reg.ticketCode}</td>
                    <td className="p-4">
                      <Badge variant={reg.attendanceStatus === "ATTENDED" ? "success" : "warning"}>
                        {reg.attendanceStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Create Event Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={handleResetModal}
        title="Create Event (Queued in Global Context)"
      >
        {!createdSuccess ? (
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
              <input
                type="text"
                placeholder="e.g. Pune Developer Day 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Hackathons</option>
                  <option>Career</option>
                  <option>Startups</option>
                  <option>Cybersecurity</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option>Mumbai</option>
                  <option>Pune</option>
                  <option>Bengaluru</option>
                  <option>Delhi NCR</option>
                  <option>Hyderabad</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seat Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min={10}
                  max={2000}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pass Price (INR ₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                  placeholder="0 for Free entry"
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Venue Selection (Double-Booking Protected)
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option>VESIT Main Auditorium & Seminar Complex, Chembur, Mumbai</option>
                <option>Jio World Convention Centre - Lotus Hall, BKC, Mumbai</option>
                <option>COEP Technological University - Convocation Hall, Pune</option>
                <option>Bombay Exhibition Centre (NESCO) - Hall 2, Goregaon, Mumbai</option>
                <option>VJTI Quadrangle & Seminar Hall 1, Matunga, Mumbai</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
              <textarea
                rows={2}
                placeholder="Key objectives, agenda highlights, and takeaways..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={handleResetModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit for Admin Approval
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Event Created & Queued!</h4>
            <p className="text-xs text-slate-500">
              The event has been placed into the <strong>Admin Approval Queue</strong> and is now reactive across all dashboard views.
            </p>
            <Button variant="primary" size="sm" onClick={handleResetModal}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
