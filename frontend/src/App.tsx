import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home.tsx";
import PublicEvent from "./pages/PublicEvent.tsx";
import TicketPage from "./pages/TicketPage.tsx";
import OrganizeAuth from "./pages/OrganizerAuth.tsx";
import OrganizeDashboard from "./pages/OrganizerDashboard.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import EventRegistration from "./pages/EventRegistrations.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/organizer/auth">Organizer Portal</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/event" element={<PublicEvent />}></Route>
          <Route path="/ticket/:tickedId" element={<TicketPage />}></Route>

          <Route path="/organizer/auth" element={<OrganizeAuth />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/organizer/dashboard"
              element={<OrganizeDashboard />}
            ></Route>
            <Route
              path="/organizer/create-event"
              element={<CreateEvent />}
            ></Route>
            <Route
              path="/organizer/registrations/:eventId"
              element={<EventRegistration />}
            ></Route>
          </Route>
          <Route path="*" element={<h1>404 Not Found</h1>}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
