import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../api";

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  availableTickets: number;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        const fetchedEvents = Array.isArray(res.data) ? res.data : [];

        // Sort: Active events first, then by date (soonest to latest)
        const sortedEvents = [...fetchedEvents].sort((a, b) => {
          const isAExpired = new Date(a.date) < new Date();
          const isBExpired = new Date(b.date) < new Date();

          if (!isAExpired && isBExpired) return -1;
          if (isAExpired && !isBExpired) return 1;

          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setEvents(sortedEvents);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">
            Loading public events...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <p className="text-xl text-red-600 font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-12 px-6 rounded-[2.5rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 animate-pulse-slow"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Unforgettable <br /> Experiences Await
          </h1>
          <p className="text-lg text-indigo-100/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover, register, and attend the most exciting events in your city.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3.5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl shadow-white/5 text-sm uppercase tracking-widest">
              Explore Events
            </button>
            <Link to="/organizer/auth" className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all backdrop-blur-md text-sm uppercase tracking-widest">
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Upcoming Events</h2>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">Handpicked experiences just for you</p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-20 text-center border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No Events Found</h3>
            <p className="text-gray-500 font-medium text-sm">Quiet at the moment. Check back soon for new arrivals.</p>
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
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-2">
                      <div className="bg-indigo-600/10 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-600/10">
                        Entertainment
                      </div>
                      {new Date(event.date) < new Date() && (
                        <div className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-500/10">
                          Completed
                        </div>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      event.availableTickets > 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/10'
                    }`}>
                      {event.availableTickets > 0 ? `${event.availableTickets} Slots` : 'Sold Out'}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                    {event.title}
                  </h3>

                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-center text-gray-500">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-indigo-600/10 transition-colors">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-300">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>

                    <div className="flex items-center text-gray-500">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-purple-600/10 transition-colors">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-300">{event.venue}</span>
                    </div>
                  </div>

                  <Link to={`/events/${event._id}`} className="mt-auto">
                    <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-xl transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-neutral-100">
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
