import React, { useState } from "react";
import { Users, UserCheck, Calendar, Check, X, IndianRupee, Trash2, CheckCircle2, Clock, Shield, Sparkles } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useEvents } from "../../hooks/useEvents";
import { useAuth } from "../../hooks/useAuth";

export function AdminDashboard() {
  // Global Context consumption (useContext) via custom hooks
  const { events, pendingEvents, approveEvent, rejectEvent, deleteEvent, stats } = useEvents();
  const { user, isAuthenticated, quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "all"

  return (
    <div className="space-y-6">
      {/* Active Session Warning Banner if not logged in as ADMIN */}
      {(!isAuthenticated || user?.role !== "ADMIN") && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">Admin Session Required to Approve / Reject Events</p>
              <p className="text-xs text-amber-800">
                You are currently in unauthenticated preview mode (offline). Sign in as <span className="font-mono font-bold">ADMIN</span> to verify credentials and execute real-time approvals.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap text-xs shadow-xs"
            onClick={() => quickLogin("ADMIN")}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> 1-Click Login as Admin
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Admin Overview (India)</h1>
        <p className="text-xs text-slate-500">
          Monitor Indian campus ecosystems, review organizer event requests, and oversee platform health across Maharashtra & NCR.
        </p>
      </div>

      {/* Analytics Stat Cards connected to EventContext dynamic stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Registered Users</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalUsers.toLocaleString("en-IN")}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">College Organizers</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalOrganizers}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Events Listed</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalEvents}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stats.publishedEvents} Approved • {stats.pendingApprovals} Pending</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Platform Revenue</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.platformRevenue}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stats.totalRegistrations} Total Bookings</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Event Approval Requests Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Event Management & Approvals</h2>
            <p className="text-xs text-slate-500">Review organizer event listings across India before public publication.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-amber-100 text-amber-900 font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Pending Review ({pendingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "bg-indigo-100 text-indigo-900 font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Events ({events.length})
            </button>
          </div>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          {activeTab === "pending" && pendingEvents.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">All submissions reviewed!</p>
              <p className="text-xs text-slate-500">No events currently awaiting admin approval in the queue.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Organizer</th>
                  <th className="p-4">Venue & City</th>
                  <th className="p-4">Seats & Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === "pending" ? pendingEvents : events).map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">
                      <div>{evt.title}</div>
                      <span className="text-[10px] text-slate-400 font-mono">Org ID: {evt.organizerId}</span>
                    </td>
                    <td className="p-4">{evt.organizer}</td>
                    <td className="p-4">{evt.venue}</td>
                    <td className="p-4 font-medium">
                      <div>{evt.registered} / {evt.capacity} seats</div>
                      <div className="text-slate-400">{evt.price === 0 ? "Free" : `₹${evt.price}`}</div>
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {evt.approvalStatus === "PENDING" ? (
                        <>
                          <Button variant="emerald" size="sm" onClick={() => approveEvent(evt.id)}>
                            <Check className="w-3.5 h-3.5 mr-1" /> Approve
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => rejectEvent(evt.id)}>
                            <X className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        </>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-slate-400 font-mono text-[11px]">
                            {evt.approvalStatus === "APPROVED" ? "Published" : "Rejected"}
                          </span>
                          <button
                            onClick={() => deleteEvent(evt.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
