import React, { useState } from "react";
import { Calendar, Plus, Users, QrCode, Building, CheckCircle2, Clock } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Modal } from "../../components/ui/Modal";
import { MOCK_EVENTS } from "../../data/mockData";

export function OrganizerDashboard() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const myEvents = MOCK_EVENTS.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizer Workspace</h1>
          <p className="text-xs text-slate-500">Manage your active event listings, track seat allocations, and scan QR tickets.</p>
        </div>
        <Button variant="primary" size="md" className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create New Event
        </Button>
      </div>

      {/* Capacity Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {myEvents.map((evt) => (
          <Card key={evt.id} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary">{evt.category}</Badge>
              <Badge variant={evt.approvalStatus === "APPROVED" ? "success" : "warning"}>
                {evt.approvalStatus}
              </Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
            <p className="text-xs text-slate-500">{evt.venue}</p>

            <ProgressBar value={evt.registered} max={evt.capacity} />

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="text-slate-500">Date: {evt.date}</span>
              <button className="text-indigo-600 font-semibold hover:underline">Scan Entry QR</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Attendees List */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold text-slate-900">Recent Registrations (Live Feed)</h2>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-4">Participant Name</th>
                <th className="p-4">Event</th>
                <th className="p-4">Ticket Code</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">Alex Johnson</td>
                <td className="p-4">TechPulse 2026: AI Summit</td>
                <td className="p-4 font-mono text-indigo-600">ES-2026-901-78X</td>
                <td className="p-4">2026-08-10</td>
                <td className="p-4"><Badge variant="success">CHECKED IN</Badge></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-900">Sarah Jenkins</td>
                <td className="p-4">DesignMatrix UI/UX Masterclass</td>
                <td className="p-4 font-mono text-indigo-600">ES-2026-902-31Y</td>
                <td className="p-4">2026-08-12</td>
                <td className="p-4"><Badge variant="warning">PENDING ENTRY</Badge></td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Create Event Modal Preview */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setCreatedSuccess(false);
        }}
        title="Create Event (UI Preview)"
      >
        {!createdSuccess ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCreatedSuccess(true);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
              <input
                type="text"
                placeholder="e.g. NextGen Web Summit"
                required
                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white">
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Cybersecurity</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seat Capacity</label>
                <input
                  type="number"
                  defaultValue={150}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Venue Selection (Double-Booking Protected)</label>
              <select className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option>Grand Convention Center - Hall A</option>
                <option>Innovation Hub Auditorium</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Submit for Approval</Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Event Created & Queued for Approval!</h4>
            <p className="text-xs text-slate-500">
              The event has been placed into the Admin approval queue. Persistent DB saving will occur in Practical 4.
            </p>
            <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(false)}>Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
