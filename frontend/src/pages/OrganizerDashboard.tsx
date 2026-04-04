import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyEvents, logout } from "../api";

interface Event {
  _id: string;
  title: string;
  date: string;
  approvalMethod: string;
  availableTickets: number;
}

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const organizerName: string | null = localStorage.getItem("organizerName");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        setLoading(false);
        navigate("/organizer/auth");
        return;
      }
      try {
        const res = await getMyEvents();
        const fetchedEvents = Array.isArray(res.data) ? res.data : [];

        const sortedEvents = [...fetchedEvents].sort((a, b) => {
          const isAExpired = new Date(a.date) < new Date();
          const isBExpired = new Date(b.date) < new Date();

          if (!isAExpired && isBExpired) return -1;
          if (isAExpired && !isBExpired) return 1;

          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setEvents(sortedEvents);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          "Failed to fetch your events. Token might be expired."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/organizer/auth");
    } catch (err) {
      console.error("Logout failed", err);
      // fallback even if logout api fails
      localStorage.removeItem("token");
      localStorage.removeItem("organizerName");
      navigate("/organizer/auth");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-red-600 text-xl mb-6">{error}</p>
          <Link
            to="/organizer/auth"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Premium Welcome Header */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden mb-8 border-white/5">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-900 to-slate-900 p-6 md:p-10 relative overflow-hidden">
          {/* Abstract Graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] flex items-center justify-center mr-5 shadow-2xl group cursor-default">
                <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-1">
                  Welcome back, <span className="text-indigo-200">{organizerName || "Organizer"}</span>
                </h1>
                <p className="text-indigo-200/70 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  System Status: Fully Operational
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl border border-white/10 transition-all flex items-center self-start md:self-center text-[10px] uppercase tracking-widest"
            >
              <svg className="w-4 h-4 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary / Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="flex-1 glass-card p-6 rounded-[2rem] border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Impact Overview</p>
            <h3 className="text-2xl font-black text-white italic">{events.length} <span className="text-gray-600 font-bold ml-1">Events Registry</span></h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        
        <Link to="/organizer/create-event" className="lg:w-64">
          <button className="w-full h-full p-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2rem] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center group uppercase tracking-widest text-[10px] gap-3">
            <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-90 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Create New
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-3xl font-bold mb-10 animate-pulse flex items-center gap-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-24 text-center border-white/5 border-dashed border-2 bg-transparent">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-white mb-4">Start Your Legacy</h3>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
            Your dashboard is quiet, but it's full of potential. Create your first event and watch the registrations roll in.
          </p>
          <Link to="/organizer/create-event">
            <button className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl shadow-white/5">
              Launch First Event
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="group glass-card rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 border-white/5"
            >
              <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <h4 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex gap-2">
                       {new Date(event.date) < new Date() && (
                        <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 rounded-full">
                          Completed
                        </span>
                      )}
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full ${
                        event.approvalMethod === "manual" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {event.approvalMethod === "manual" ? "Manual Review" : "Auto-Approve"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm font-bold text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${event.availableTickets > 0 ?'text-emerald-400' : 'text-rose-400'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{event.availableTickets} Tickets Available</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4">
                  <Link to={`/events/${event._id}`} className="flex-1">
                    <button className="w-full h-full px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </button>
                  </Link>
                  <Link to={`/organizer/registrations/${event._id}`} className="flex-1">
                    <button className="w-full h-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Manage
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
