"use client";

import { useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { getTicketId } from "@/lib/api";

export default function TicketLookup({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId || !email) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getTicketId(eventId, email);
      router.push(`/tickets/${res.data.ticketId}`);
    } catch (err: Error | unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Could not find a ticket for this email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] md:min-h-screen flex items-start justify-center pt-2 md:pt-4 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[120px] -z-10 animate-pulse-slow"></div>

      <div className="w-full max-w-md glass-card rounded-[2.5rem] overflow-hidden border-white/10 shadow-2xl relative">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 md:p-8 text-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16"></div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight mb-0.5 uppercase italic">RETRIEVE ACCESS</h2>
          <p className="text-indigo-100/70 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] leading-relaxed">Identity verification</p>
        </div>

        <div className="p-5 md:p-10 space-y-5 md:space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Target Event</p>
            <p className="text-xs font-mono font-bold text-gray-300 break-all">{eventId}</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white placeholder:text-gray-600 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span>Syncing...</span>
                </div>
              ) : (
                <span>Request Ticket</span>
              )}
            </button>
          </form>

          <button onClick={() => router.push("/")} className="w-full py-3 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest border border-white/5 rounded-xl hover:bg-white/5">
            Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
}