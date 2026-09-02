import React, { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Modal } from "../../components/ui/Modal";
import { useEvents } from "../../hooks/useEvents";

export function OrganizerDashboard() {
  // Global Context consumption (useContext) via useEvents hook
  const { events, addEvent } = useEvents();

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

  // Show active organizer listings
  const myEvents = events.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizer Workspace (India)</h1>
          <p className="text-xs text-slate-500">
            Manage your campus and corporate event listings, track seat allocations, and scan QR ticket passes.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="gap-2"
          onClick={() => {
            setCreatedSuccess(false);
            setCreateModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Create New Event
        </Button>
      </div>

      {/* Capacity Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myEvents.map((evt) => (
          <Card key={evt.id} className="p-5 space-y-4">
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
            <p className="text-xs text-slate-500">{evt.venue}</p>

            <ProgressBar value={evt.registered} max={evt.capacity} />

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="text-slate-500 font-semibold">{evt.price === 0 ? "Free" : `₹${evt.price}`}</span>
              <button className="text-indigo-600 font-semibold hover:underline">Scan Entry QR</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Attendees List */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold text-slate-900">Recent Indian Student & Delegate Registrations</h2>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-4">Participant Name</th>
                <th className="p-4">Event Title</th>
                <th className="p-4">Ticket Pass Code</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">Aarav Mehta (VESIT)</td>
                <td className="p-4">India AI & Full Stack Summit 2026</td>
                <td className="p-4 font-mono text-indigo-600">ES-MUM-2026-901-78X</td>
                <td className="p-4">10 Aug 2026</td>
                <td className="p-4">
                  <Badge variant="success">CHECKED IN</Badge>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">Sneha Patil (COEP)</td>
                <td className="p-4">Mumbai UI/UX DesignMatrix Masterclass</td>
                <td className="p-4 font-mono text-indigo-600">ES-MUM-2026-902-31Y</td>
                <td className="p-4">12 Aug 2026</td>
                <td className="p-4">
                  <Badge variant="warning">PENDING ENTRY</Badge>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">Rohan Kulkarni (VJTI)</td>
                <td className="p-4">HackMaharashtra 2026: 36-Hour Hackathon</td>
                <td className="p-4 font-mono text-indigo-600">ES-PUN-2026-903-55K</td>
                <td className="p-4">18 Aug 2026</td>
                <td className="p-4">
                  <Badge variant="success">CHECKED IN</Badge>
                </td>
              </tr>
            </tbody>
          </table>
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
