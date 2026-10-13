import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { EventProvider } from "./context/EventContext";
import { ToastContainer } from "./components/common/ToastContainer";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";

import { HomePage } from "./pages/HomePage";
import { EventsPage } from "./pages/EventsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { VenuesPage } from "./pages/VenuesPage";
import { LoginPage } from "./pages/LoginPage";

import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import { OrganizerDashboard } from "./pages/dashboards/OrganizerDashboard";
import { ParticipantDashboard } from "./pages/dashboards/ParticipantDashboard";

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <SocketProvider>
          <EventProvider>
            <BrowserRouter>
              <ToastContainer />
              <Routes>
                {/* Public Main Site Routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="events/:id" element={<EventDetailPage />} />
                  <Route path="venues" element={<VenuesPage />} />
                  <Route path="login" element={<LoginPage />} />
                </Route>

                {/* Dashboard Shell Routes (Separated role pages with shared DashboardLayout) */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/dashboard/participant" replace />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="organizer" element={<OrganizerDashboard />} />
                  <Route path="participant" element={<ParticipantDashboard />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </EventProvider>
        </SocketProvider>
      </AuthProvider>
    </AppProvider>
  );
}

