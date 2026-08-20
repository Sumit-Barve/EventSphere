import React from "react";
import { Building, MapPin, Users, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardBody } from "../components/ui/Card";
import { MOCK_VENUES } from "../data/mockData";

export function VenuesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Partner Venues</h1>
        <p className="text-sm text-slate-600">Browse verified convention centers, lab spaces, and auditoriums with built-in double-booking protection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VENUES.map((venue) => (
          <Card key={venue.id} hoverable className="flex flex-col">
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <Badge variant={venue.status === "AVAILABLE" ? "success" : "warning"}>
                  {venue.status}
                </Badge>
              </div>
            </div>

            <CardBody className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{venue.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {venue.location}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Users className="w-4 h-4 text-indigo-600" /> Seating Capacity: {venue.capacity} Persons
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {venue.facilities.map((fac) => (
                    <span key={fac} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">ID: {venue.id}</span>
                <Button variant="outline" size="sm">Request Booking</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
