import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Grid, List, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardBody } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";
import { MOCK_EVENTS } from "../data/mockData";

export function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");

  const categories = ["ALL", "Technology", "Design", "Cybersecurity", "Environment", "Cloud"];

  const filteredEvents = MOCK_EVENTS.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "ALL" || evt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Events</h1>
        <p className="text-sm text-slate-600">Search and filter through upcoming technology conferences, design workshops, and summits.</p>
      </div>

      {/* Control Bar: Search & Category Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-96">
            <Input
              icon={Search}
              placeholder="Search events by title, keyword, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Grid className="w-4 h-4" /> Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 self-center mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Results Count */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
        <span>Showing {filteredEvents.length} events</span>
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-indigo-600 hover:underline">
            Clear search filter
          </button>
        )}
      </div>

      {/* Grid or List View Render */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <Card key={evt.id} hoverable className="flex flex-col">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img src={evt.banner} alt={evt.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="primary">{evt.category}</Badge>
                  {evt.price === 0 && <Badge variant="success">FREE</Badge>}
                </div>
              </div>

              <CardBody className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <ProgressBar value={evt.registered} max={evt.capacity} />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">
                    {evt.price === 0 ? "Free" : `$${evt.price.toFixed(2)}`}
                  </span>
                  <Link to={`/events/${evt.id}`}>
                    <Button variant="primary" size="sm">View Details</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((evt) => (
            <Card key={evt.id} hoverable className="p-4 flex flex-col md:flex-row items-center gap-6">
              <img src={evt.banner} alt={evt.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{evt.category}</Badge>
                  {evt.price === 0 && <Badge variant="success">FREE</Badge>}
                  <span className="text-xs text-slate-400 font-mono">ID: {evt.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{evt.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-1">{evt.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {evt.venue}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {evt.date}</span>
                </div>
              </div>
              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                <span className="text-lg font-extrabold text-slate-900">
                  {evt.price === 0 ? "Free" : `$${evt.price.toFixed(2)}`}
                </span>
                <Link to={`/events/${evt.id}`}>
                  <Button variant="primary" size="sm">View Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
