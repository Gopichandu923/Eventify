"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { getTicketDetails } from "@/lib/api";

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
  event: EventDetails;
}

export default function TicketVerification({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyTicket = async () => {
      if (!ticketId) {
        setError("No ticket ID provided.");
        setLoading(false);
        return;
      }

      try {
        const res = await getTicketDetails(ticketId);
        setTicket(res.data);
        setError(null);
} catch (err: Error | unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "This ticket is INVALID or does not exist in our system.");
      } finally {
        setLoading(false);
      }
    };

    verifyTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0c]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Protocol: Verifying...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-950/20 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0c] -z-10"></div>
        <div className="glass-card p-8 rounded-3xl border-rose-500/20 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-rose-500 mb-1">INVALID UNIT</h2>
          <p className="text-xs text-gray-500 font-medium mb-6 uppercase tracking-widest leading-relaxed">{error || "Verification Failed"}</p>
          <Link href="/" className="inline-block w-full py-3.5 bg-white text-indigo-600 font-black rounded-xl hover:bg-neutral-100 transition-all uppercase tracking-widest text-[10px]">
            Return to Port
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = ticket.status === "Approved";

  return (
    <div className="min-h-[70vh] md:min-h-screen flex items-start justify-center pt-2 md:pt-4 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[120px] -z-10 animate-pulse-slow"></div>

      <div className="w-full max-w-md glass-card rounded-[2.5rem] overflow-hidden border-white/10 shadow-2xl relative">
        <div className={`p-6 text-center ${isApproved ? "bg-emerald-600/10" : "bg-amber-600/10"} relative`}>
          <div className="relative z-10">
            {isApproved ? (
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
            <h2 className={`text-2xl font-black tracking-tighter uppercase ${isApproved ? "text-emerald-400" : "text-amber-400"}`}>
              {isApproved ? "Verified Access" : "Awaiting Review"}
            </h2>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Eventify Node Connection</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Entry Registry</p>
              <p className="text-lg font-bold text-white uppercase italic truncate">{ticket.event.title}</p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Identity</p>
                  <p className="text-base font-bold text-indigo-400 leading-none">{ticket.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{ticket.email}</p>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${isApproved ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {ticket.status}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Launch Date</p>
                  <p className="text-xs font-bold text-white">{new Date(ticket.event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Protocol ID</p>
                  <p className="text-xs font-mono font-bold text-white">#{ticketId?.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button onClick={() => window.location.reload()} className="w-full py-3.5 bg-white text-indigo-600 font-black rounded-xl hover:bg-neutral-100 transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-[10px]">
              Scan Next Unit
            </button>
            <Link href="/organizer/dashboard" className="flex justify-center items-center gap-2 text-gray-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
              Command Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}