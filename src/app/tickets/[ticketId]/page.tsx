"use client";

import { use, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getTicketDetails } from "@/actions/events";

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

export default function TicketPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
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
        setTicket({
          ticketId: res.ticketId,
          name: res.name,
          email: res.email,
          status: res.status,
          event: res.event,
        } as TicketData);
        setError(null);
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load ticket details.";
        setError(errorMessage);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#0a0a0c]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hydrating Unit...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="glass-card p-8 text-center border-rose-500/20">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">Access Restricted</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-8">{error || "Terminal Link Broken"}</p>
          <button onClick={() => (window.location.href = "/")} className="w-full py-4 bg-indigo-600 text-white font-black text-[10px] rounded-xl hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-xl shadow-indigo-600/20">
            Direct Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 relative px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[120px] -z-10 animate-pulse-slow"></div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row backdrop-blur-3xl border-white/10 shadow-2xl">
          <div className="flex-1 p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8 md:mb-12">
                <div>
                  <h2 className="text-[8px] md:text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-1.5 md:mb-2">Authenticated Entry</h2>
                  <h3 className="text-2xl md:text-5xl font-black text-white italic tracking-tighter">ADMIT ONE</h3>
                </div>
                <div className={`px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-xs font-black uppercase tracking-widest border ${
                  ticket.status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : ticket.status === "Pending"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}>
                  {ticket.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-6 md:space-y-8">
                  <section>
                    <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Verified Attendee</p>
                    <p className="text-xl md:text-2xl font-bold text-white mb-0.5 truncate">{ticket.name}</p>
                    <p className="text-gray-400 font-medium text-xs truncate max-w-[200px] md:max-w-none">{ticket.email}</p>
                  </section>

                  <section>
                    <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Event Identity</p>
                    <p className="text-xl md:text-3xl font-black text-indigo-100 leading-tight mb-2 uppercase italic truncate-2-lines">{ticket.event.title}</p>
                  </section>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <section>
                      <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Schedule</p>
                      <p className="text-sm md:text-lg font-bold text-white">
                        {new Date(ticket.event.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </section>
                    <section>
                      <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Venue</p>
                      <p className="text-sm md:text-lg font-bold text-white truncate">{ticket.event.venue}</p>
                    </section>
                  </div>

                  <section>
                    <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5">Digital Signature</p>
                    <p className="text-[9px] md:text-xs font-mono text-indigo-400/60 break-all">{ticketId}</p>
                  </section>
                </div>
              </div>

              <div className="mt-8 md:mt-16 flex items-center justify-between pt-6 md:pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-600 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xl md:text-2xl font-black tracking-tight text-white/40">Eventify</span>
                </div>
                <div className="text-right">
                  <p className="text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Serial N°</p>
                  <p className="text-xs md:text-sm font-mono font-bold text-white">#{ticketId?.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-80 bg-white/2 border-t md:border-t-0 md:border-l border-white/5 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
            <div className="hidden md:block absolute -top-5 -left-5 w-10 h-10 bg-slate-950 rounded-full border border-white/5"></div>
            <div className="hidden md:block absolute -bottom-5 -left-5 w-10 h-10 bg-slate-950 rounded-full border border-white/5"></div>

            <div className="relative z-10 text-center">
              <div className="mb-4 md:mb-6 bg-white/5 p-4 md:p-5 rounded-3xl border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
                <QRCodeSVG
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/tickets/verify/${ticketId}`}
                  size={typeof window !== "undefined" && window.innerWidth < 768 ? 130 : 160}
                  level="H"
                  fgColor="#ffffff"
                  bgColor="transparent"
                  className="mx-auto"
                />
              </div>
              <p className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Scan to Verify</p>
              <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 print:hidden">
        {ticket.status === "Approved" && (
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 md:px-10 py-4 md:py-5 bg-white text-indigo-600 font-black rounded-xl md:rounded-2xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest text-[10px] md:text-sm"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save Credential
          </button>
        )}
        <button onClick={() => (window.location.href = "/")} className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl md:rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-[10px] md:text-sm text-center">
          Return to Hub
        </button>
      </div>
    </div>
  );
}