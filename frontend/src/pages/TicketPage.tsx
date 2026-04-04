import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTicketDetails } from "../api";
import { QRCodeSVG } from "qrcode.react";

interface EventDetails {
  title: string;
  date: string;
  venue: string;
}

interface TicketData {
  ticketId: string;
  name: string;
  email: string;
  status: "Approved" | "Pending" | "Rejected";
  event: EventDetails & { _id: string };
}

const TicketPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setError("Invalid ticket ID provided.");
        setLoading(false);
        return;
      }

      try {
        const res = await getTicketDetails(ticketId);
        console.log(res)
        setTicket(res.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load ticket details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl font-semibold text-gray-600">
        Loading ticket...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold text-red-700 text-center mb-4">
          Ticket Error
        </h2>
        <p className="text-center text-red-600 text-lg">
          {error || "Ticket data could not be loaded."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 relative px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[120px] -z-10 animate-pulse-slow"></div>

      <div className="relative group">
        {/* Animated Glow Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row backdrop-blur-3xl border-white/10 shadow-2xl">
          {/* Main Content Area */}
          <div className="flex-1 p-10 md:p-12 relative overflow-hidden">
            {/* Holographic Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Authenticated Entry</h2>
                  <h3 className="text-5xl font-black text-white italic tracking-tighter">ADMIT ONE</h3>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                  ticket.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  ticket.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {ticket.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <section>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Verified Attendee</p>
                    <p className="text-2xl font-bold text-white mb-1">{ticket.name}</p>
                    <p className="text-gray-400 font-medium text-sm">{ticket.email}</p>
                  </section>

                  <section>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Event Identity</p>
                    <p className="text-3xl font-black text-indigo-100 leading-tight mb-2 uppercase italic">{ticket.event.title}</p>
                  </section>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <section>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Schedule</p>
                      <p className="text-lg font-bold text-white">
                        {new Date(ticket.event.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </section>
                    <section>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Venue</p>
                      <p className="text-lg font-bold text-white truncate">{ticket.event.venue}</p>
                    </section>
                  </div>

                  <section>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Digital Signature</p>
                    <p className="text-xs font-mono text-indigo-400/60 break-all">{ticketId}</p>
                  </section>
                </div>
              </div>

              <div className="mt-16 flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-black tracking-tight text-white/40">Eventify</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Serial N°</p>
                  <p className="text-sm font-mono font-bold text-white">#{ticketId?.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Stub */}
          <div className="md:w-80 bg-white/2 border-l border-white/5 p-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Visual Stub Perforation Effect */}
            <div className="hidden md:block absolute -top-5 -left-5 w-10 h-10 bg-slate-950 rounded-full border border-white/5"></div>
            <div className="hidden md:block absolute -bottom-5 -left-5 w-10 h-10 bg-slate-950 rounded-full border border-white/5"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-6 bg-white/5 p-5 rounded-3xl border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
                <QRCodeSVG
                  value={`${window.location.origin}/tickets/verify/${ticketId}`}
                  size={160}
                  level="H"
                  fgColor="#ffffff"
                  bgColor="transparent"
                  className="mx-auto"
                />
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Scan to Verify</p>
              <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-6 print:hidden">
        {ticket.status === "Approved" && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save as PDF / Print
          </button>
        )}
        <button 
          onClick={() => window.location.href = '/'}
          className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-sm"
        >
          Return to Hub
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .glass-card { 
            background: white !important; 
            color: black !important;
            border: 1px solid #eee !important;
            box-shadow: none !important;
          }
          .text-white { color: black !important; }
          .text-gray-400, .text-gray-500 { color: #666 !important; }
          .text-indigo-100, .text-indigo-400 { color: #4338ca !important; }
          .bg-white\\/5, .bg-white\\/2 { background: #f9fafb !important; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default TicketPage;
