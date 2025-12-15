import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home.tsx";
import PublicEvent from "./pages/PublicEvent.tsx";
import TicketPage from "./pages/TicketPage.tsx";
import OrganizerAuth from "./pages/OrganizerAuth.tsx";
import OrganizerDashboard from "./pages/OrganizerDashboard.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import EventRegistrations from "./pages/EventRegistrations.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import TicketLookup from "./pages/TicketLookup.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow p-4 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-600">Eventify</div>
          <div className="space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 transition duration-150"
            >
              Home
            </Link>
            <Link
              to="/organizer/auth"
              className="text-gray-600 hover:text-indigo-600 transition duration-150"
            >
              Organizer Portal
            </Link>
          </div>
        </nav>
        <div className="container mx-auto p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<PublicEvent />} />
            <Route path="/tickets/:ticketId" element={<TicketPage />} />
            <Route path="/events/:eventId/tickets" element={<TicketLookup />} />

            {/* Organizer Auth */}
            <Route path="/organizer/auth" element={<OrganizerAuth />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/organizer/dashboard"
                element={<OrganizerDashboard />}
              />
              <Route path="/organizer/create-event" element={<CreateEvent />} />
              <Route
                path="/organizer/registrations/:eventId"
                element={<EventRegistrations />}
              />
            </Route>
            <Route
              path="*"
              element={<h1 className="text-2xl text-red-600">404 Not Found</h1>}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
