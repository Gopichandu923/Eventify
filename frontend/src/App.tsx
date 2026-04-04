import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home.tsx";
import PublicEvent from "./pages/PublicEvent.tsx";
import TicketPage from "./pages/TicketPage.tsx";
import OrganizerAuth from "./pages/OrganizerAuth.tsx";
import OrganizerDashboard from "./pages/OrganizerDashboard.tsx";
import CreateEvent from "./pages/CreateEvent.tsx";
import EventRegistrations from "./pages/EventRegistrations.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import TicketLookup from "./pages/TicketLookup.tsx";
import TicketVerification from "./pages/TicketVerification.tsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
        {/* Animated Background Graphics */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow delay-700"></div>
          <div className="absolute top-[30%] left-[60%] w-[20%] h-[20%] rounded-full bg-blue-500/5 blur-[80px] animate-float"></div>
        </div>

        {/* Modern Nav Bar */}
        <nav className="sticky top-0 z-50 glass border-b border-white/5 backdrop-blur-xl">
          <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group shrink-0"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Eventify
              </span>
            </Link>

            <div className="flex items-center space-x-3 md:space-x-8">
              <Link
                to="/"
                className="text-[10px] md:text-sm font-bold text-gray-400 hover:text-white transition duration-200 uppercase tracking-widest sm:uppercase sm:tracking-widest"
              >
                <span className="hidden sm:inline">Explore Events</span>
                <span className="sm:hidden">Events</span>
              </Link>
              <Link
                to="/organizer/auth"
                className="group relative px-4 py-2 md:px-5 md:py-2.5 flex items-center space-x-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition duration-300 overflow-hidden"
              >
                <span className="relative z-10 text-[10px] md:text-sm font-black uppercase tracking-widest">
                  <span className="hidden sm:inline">Organizer Portal</span>
                  <span className="sm:hidden">Access</span>
                </span>
                <svg className="w-3 h-3 md:w-4 md:h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>

        <main className="relative z-10 container mx-auto px-6 pt-1 pb-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<PublicEvent />} />
            <Route path="/tickets/:ticketId" element={<TicketPage />} />
            <Route
              path="/tickets/verify/:ticketId"
              element={<TicketVerification />}
            />
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
              element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <h1 className="text-9xl font-black text-white/10">404</h1>
                  <h2 className="text-3xl font-bold -mt-16 mb-4">Page Not Found</h2>
                  <p className="text-gray-400 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
                  <Link to="/" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-indigo-600/20">
                    Back to Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8 mt-12">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-sm">© 2026 Eventify. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-indigo-400">Terms</a>
              <a href="#" className="hover:text-indigo-400">Privacy</a>
              <a href="#" className="hover:text-indigo-400">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
