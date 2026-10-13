import React, { useState } from "react";
import { QrCode, Award, CheckCircle2, Calendar, MapPin, Download } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useEvents } from "../../hooks/useEvents";

export function ParticipantDashboard() {
  // Global Context consumption (useContext) via useEvents hook
  const { registrations, cancelRegistration } = useEvents();

  // Local state for modal preview of selected QR ticket (useState)
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Participant Dashboard</h1>
        <p className="text-xs text-slate-500">
          Access your digital entry passes, QR codes, and event attendance certificates.
        </p>
      </div>

      {/* Ticket List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            My Registered Event Passes ({registrations.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">Instant QR verification enabled</span>
        </div>

        {registrations.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-xs">
            You have not registered for any events yet. Explore events on the Discover page.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((reg) => (
              <Card key={reg.id} className="p-5 border-l-4 border-l-indigo-600 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">DIGITAL PASS</Badge>
                    <Badge variant={reg.status === "CONFIRMED" ? "success" : "default"}>
                      {reg.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{reg.eventTitle}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {reg.venue}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date: {reg.eventDate}
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 gap-2">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Ticket Code</p>
                    <p className="text-xs font-mono font-bold text-slate-800">{reg.ticketCode}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cancelRegistration(reg.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => setSelectedTicket(reg)}
                    >
                      <QrCode className="w-4 h-4" /> View QR Pass
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Eligibility Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Certificates of Attendance</h2>
          </div>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-4">Event Title</th>
                <th className="p-4">Attendance Verification</th>
                <th className="p-4">Certificate Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-900">{reg.eventTitle}</td>
                  <td className="p-4">
                    <Badge variant={reg.attendanceStatus === "ATTENDED" ? "success" : "warning"}>
                      {reg.attendanceStatus}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {reg.certificateEligible ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ELIGIBLE
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unlocks after event attendance</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {reg.certificateEligible ? (
                      <Button variant="emerald" size="sm" className="gap-1">
                        <Download className="w-3.5 h-3.5" /> Download Certificate
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>
                        Locked
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Ticket QR Modal Preview */}
      <Modal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title="Digital QR Pass Preview"
      >
        {selectedTicket && (
          <div className="text-center space-y-6 py-2">
            <div className="bg-slate-900 text-white p-4 rounded-xl text-left space-y-2">
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                OFFICIAL ENTRY PASS
              </p>
              <h4 className="text-base font-bold">{selectedTicket.eventTitle}</h4>
              <p className="text-xs text-slate-300">{selectedTicket.venue}</p>
              <p className="text-xs font-mono text-slate-400 pt-1">Code: {selectedTicket.ticketCode}</p>
            </div>

            {/* Visual Mock QR Matrix */}
            <div className="w-48 h-48 bg-white border-2 border-slate-900 rounded-2xl mx-auto p-3 flex flex-col items-center justify-center shadow-inner relative group">
              <div className="w-full h-full bg-slate-900 rounded-lg p-2 flex items-center justify-center text-white font-mono text-center text-[10px] break-all">
                [ MOCK QR MATRIX DATA ]
                <br />
                {selectedTicket.qrData}
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Show this QR pass at the venue entrance. The organizer will scan and record your attendance timestamp.
            </p>

            <Button variant="outline" className="w-full" onClick={() => setSelectedTicket(null)}>
              Close Pass
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
