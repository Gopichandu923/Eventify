import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllEvents } from "../api";

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  availableTickets: number;
}

const Home: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await getAllEvents();
      const fetchedEvents = Array.isArray(res.data) ? res.data : [];
      
      // Sort: Active events first, then by date (soonest to latest)
      return [...fetchedEvents].sort((a: Event, b: Event) => {
        const isAExpired = new Date(a.date) < new Date();
        const isBExpired = new Date(b.date) < new Date();

        if (!isAExpired && isBExpired) return -1;
        if (isAExpired && !isBExpired) return 1;

        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    },
  });

  const events = data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest animate-pulse">Synchronizing Grid...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center glass-card p-8 rounded-3xl border-rose-500/20 max-w-sm w-full">
           <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/10">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-50">Connection Error</p>
          <p className="text-sm font-bold text-rose-400 uppercase tracking-tight italic">Protocol Failure: Grid Unreachable</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-48 md:h-64 bg-gradient-to-br from-indigo-900 to-slate-900 overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[80px] -mr-40 -mt-40 animate-pulse-slow"></div>

        <div className="absolute inset-0 p-6 md:p-16 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-4 text-white uppercase italic leading-tight">
            Unforgettable <br className="hidden md:block" /> Experiences
          </h1>
          <p className="text-[10px] md:text-lg text-indigo-100/70 max-w-xl uppercase tracking-[0.3em] font-black opacity-60">
            Node Network Registry • City Port 84
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Upcoming Events</h2>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">Handpicked experiences just for you</p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-20 text-center border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No Events Found</h3>
            <p className="text-gray-500 font-medium text-xs uppercase tracking-widest opacity-50 italic">Empty Node Registry</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event._id}
                className="group relative glass-card rounded-[2rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 transform hover:-translate-y-1 border-white/5 shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[60px] group-hover:bg-indigo-600/10 transition-all"></div>
                
                <div className="p-8 relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      <div className="bg-indigo-600/10 text-indigo-400 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-600/10">
                        Entertainment
                      </div>
                      {new Date(event.date) < new Date() && (
                        <div className="bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-500/10">
                          Completed
                        </div>
                      )}
                    </div>
                    <div className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0 ${
                      event.availableTickets > 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/10'
                    }`}>
                      {event.availableTickets > 0 ? `${event.availableTickets} Slots` : 'Sold Out'}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors uppercase tracking-tight italic">
                    {event.title}
                  </h3>

                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex flex-wrap gap-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {event.venue}
                      </div>
                    </div>
                  </div>

                  <Link to={`/events/${event._id}`} className="mt-auto">
                    <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-xl transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] hover:bg-neutral-100">
                      Reserve Access
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
