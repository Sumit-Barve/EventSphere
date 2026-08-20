import React, { useState } from "react";
import { Users, UserCheck, Calendar, Building, ShieldCheck, Check, X, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { MOCK_ADMIN_STATS, MOCK_EVENTS } from "../../data/mockData";

export function AdminDashboard() {
  const [events, setEvents] = useState(MOCK_EVENTS);

  const handleApprove = (id) => {
    setEvents(events.map(e => e.id === id ? { ...e, approvalStatus: "APPROVED", status: "PUBLISHED" } : e));
  };

  const handleReject = (id) => {
    setEvents(events.map(e => e.id === id ? { ...e, approvalStatus: "REJECTED", status: "CANCELLED" } : e));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Admin Overview</h1>
        <p className="text-xs text-slate-500">Monitor system activity, review organizer event requests, and oversee platform health.</p>
      </div>

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Users</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{MOCK_ADMIN_STATS.totalUsers}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Organizers</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{MOCK_ADMIN_STATS.totalOrganizers}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Events</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{MOCK_ADMIN_STATS.totalEvents}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Active Venues</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{MOCK_ADMIN_STATS.totalVenues}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Event Approval Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Event Approval Queue</h2>
            <p className="text-xs text-slate-500">Review organizer event listings before public publication.</p>
          </div>
          <Badge variant="warning">{events.filter(e => e.approvalStatus === "PENDING").length} Pending</Badge>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Event Title</th>
                <th className="p-4">Organizer</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">{evt.title}</td>
                  <td className="p-4">{evt.organizer}</td>
                  <td className="p-4">{evt.venue}</td>
                  <td className="p-4">
                    <Badge variant={
                      evt.approvalStatus === "APPROVED" ? "success" : evt.approvalStatus === "PENDING" ? "warning" : "danger"
                    }>
                      {evt.approvalStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {evt.approvalStatus === "PENDING" ? (
                      <>
                        <Button variant="emerald" size="sm" onClick={() => handleApprove(evt.id)}>
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleReject(evt.id)}>
                          <X className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Action Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
