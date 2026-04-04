import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyEvents, logout } from "../api";

interface Event {
  _id: string;
  title: string;
  date: string;
  approvalMethod: string;
  availableTickets: number;
}

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const organizerName: string | null = localStorage.getItem("organizerName");
  const token = localStorage.getItem("token");

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["my-events"],
    queryFn: async () => {
      if (!token) {
        navigate("/organizer/auth");
        return [];
      }
      const res = await getMyEvents();
      const fetchedEvents = Array.isArray(res.data) ? res.data : [];

      return [...fetchedEvents].sort((a: Event, b: Event) => {
        const isAExpired = new Date(a.date) < new Date();
        const isBExpired = new Date(b.date) < new Date();

        if (!isAExpired && isBExpired) return -1;
        if (isAExpired && !isBExpired) return 1;

        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    },
    enabled: !!token,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/organizer/auth");
    } catch (err) {
      console.error("Logout failed", err);
      localStorage.removeItem("token");
      localStorage.removeItem("organizerName");
      navigate("/organizer/auth");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Syncing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center glass-card p-10 rounded-3xl border-rose-500/20 max-w-sm w-full">
           <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-500/10">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">Registry Sync Lost</h3>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest leading-relaxed mb-8 opacity-60">
            Authentication token may have expired or node connection was interrupted.
          </p>
          <Link
            to="/organizer/auth"
            className="block w-full py-4 bg-white text-indigo-600 font-black text-[10px] rounded-xl hover:bg-neutral-100 transition-all uppercase tracking-widest shadow-xl shadow-white/5"
          >
            Re-Authenticate
          </Link>
        </div>
      </div>
    );
  }

  const eventList = events || [];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Premium Welcome Header */}
      <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-6 border-white/5 mx-4 md:mx-0">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-900 to-slate-900 p-5 md:p-10 relative overflow-hidden text-center md:text-left">
          {/* Abstract Graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-5">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-[1.5rem] flex items-center justify-center shadow-2xl group cursor-default shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black text-white tracking-tight mb-0.5 italic">
                  Welcome, <span className="text-indigo-200">{organizerName || "Organizer"}</span>
                </h1>
                <p className="text-indigo-200/50 text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-relaxed italic opacity-80">
                  Status: Fully Operational • Port 84
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black rounded-lg border border-white/10 transition-all flex items-center justify-center text-[9px] uppercase tracking-widest self-center md:self-auto"
            >
              <svg className="w-3.5 h-3.5 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary / Action Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 px-4 md:px-0">
        <div className="flex-1 glass-card p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5 opacity-60">Impact Overview</p>
            <h3 className="text-xl md:text-2xl font-black text-white italic">{eventList.length} <span className="text-gray-600 font-black ml-1 text-xs md:text-sm uppercase tracking-widest">Registries</span></h3>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-600/10 flex items-center justify-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        
        <Link to="/organizer/create-event" className="md:w-48">
          <button className="w-full h-full p-4 md:p-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl md:rounded-[2rem] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center group uppercase tracking-widest text-[9px] md:text-[10px] gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-90 transition-transform">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Create New
          </button>
        </Link>
      </div>

      {eventList.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-12 md:p-24 text-center border-white/5 border-dashed border-2 bg-transparent mx-4 md:mx-0">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tight italic">Start Your Legacy</h3>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto text-xs md:text-sm font-black uppercase tracking-widest leading-relaxed opacity-60">
            Your dashboard is quiet, but it's full of potential. Initialize your first node and watch the network expand.
          </p>
          <Link to="/organizer/create-event">
            <button className="px-8 md:px-10 py-4 md:py-5 bg-white text-indigo-600 font-black rounded-xl md:rounded-2xl hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-[10px]">
              Initialize Hub
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {eventList.map((event) => (
            <div
              key={event._id}
              className="group glass-card rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 border-white/5 mx-4 md:mx-0"
            >
              <div className="p-5 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-10">
                <div className="flex-1 space-y-3 md:space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h4 className="text-xl md:text-3xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic truncate max-w-full">
                      {event.title}
                    </h4>
                    <div className="flex gap-1.5 font-black">
                       {new Date(event.date) < new Date() && (
                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-rose-500/10 text-rose-400 text-[8px] md:text-[9px] uppercase tracking-widest border border-rose-500/20 rounded-full">
                          Completed
                        </span>
                      )}
                      <span className={`px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[9px] uppercase tracking-widest border rounded-full ${
                        event.approvalMethod === "manual" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {event.approvalMethod === "manual" ? "Manual" : "Auto"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 md:gap-x-10 gap-y-3 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-400">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center ${event.availableTickets > 0 ?'text-emerald-400' : 'text-rose-400'}`}>
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <span className="text-gray-400">{event.availableTickets} Slots Available</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-nowrap gap-3">
                  <Link to={`/events/${event._id}`} className="flex-1">
                    <button className="w-full h-full px-4 py-3 md:px-6 md:py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl md:rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest">
                       <span className="hidden sm:inline">Preview Unit</span>
                       <span className="sm:hidden text-indigo-400">View</span>
                    </button>
                  </Link>
                  <Link to={`/organizer/registrations/${event._id}`} className="flex-1">
                    <button className="w-full h-full px-4 py-3 md:px-8 md:py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl md:rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest">
                      Manage Registry
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
