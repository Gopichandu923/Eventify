"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { getEventDetails, registerForEvent } from "@/actions/events";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  approvalMode: "auto" | "manual";
  availableTickets: number;
}

export default function PublicEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEventDetails(id)
      .then((data) => {
        setEvent(data as Event);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRegistrationData({ ...registrationData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !event) return;
    setSubmitting(true);
    try {
      const res = await registerForEvent({ eventId: id, ...registrationData });
      const { ticketId: tid, status } = res;
      const statusMsg =
        status === "Approved"
          ? 'Your ticket is immediately "Approved"!'
          : 'Your registration is "Pending" until the organizer takes action.';
      setMessage(`Registration successful! ${statusMsg} Please use the download link below.`);
      setTicketId(tid);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "Server error.";
      setMessage("Registration failed: " + errorMessage);
      setTicketId(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0a0a0c]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">
            Hydrating Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <div className="glass-card p-10 text-center border-rose-500/20">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/10">
            <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 opacity-50 italic">
            Registry Link Failed
          </p>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight italic">
            Access Restricted
          </h2>
          <Link
            href="/"
            className="inline-block px-10 py-4 bg-white text-indigo-600 font-black text-[10px] rounded-xl hover:bg-neutral-100 transition-all uppercase tracking-widest shadow-xl shadow-white/5"
          >
            Direct Terminal Return
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = event.availableTickets <= 0;
  const isExpired = new Date(event.date) < new Date();

  return (
    <div className="max-w-5xl mx-auto pb-6 px-4 md:px-0">
      <div className="glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-white/5">
        <div className="relative h-44 md:h-52 bg-gradient-to-br from-indigo-900 to-slate-900 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[80px] -mr-40 -mt-40 animate-pulse-slow"></div>

          <div className="absolute inset-0 p-5 md:p-10 flex flex-col justify-end">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {isExpired ? (
                <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Completed
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Active
                </span>
              )}
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                {event.approvalMode === "auto" ? "Instant" : "Review Req."}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2 leading-tight uppercase truncate-2-lines italic">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(event.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {event.venue}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x lg:divide-white/5">
          <div className="lg:col-span-2 p-6 md:p-10">
            <h3 className="text-lg font-black mb-4 text-indigo-400 uppercase tracking-[0.2em] text-[10px] italic">
              Registry Details
            </h3>
            <p className="text-gray-400 text-base leading-relaxed mb-8 whitespace-pre-line">
              {event.description}
            </p>

            <div className="p-6 rounded-[1.5rem] bg-indigo-600/5 border border-indigo-500/10 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black uppercase tracking-tight italic">
                  Existing Access?
                </h4>
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mb-4 font-black uppercase tracking-widest italic leading-relaxed opacity-60">
                Verified attendees can retrieve credentials via secure mail sync.
              </p>
              <Link href={`/events/${id}/tickets`}>
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black rounded-lg border border-white/10 transition-all flex items-center space-x-2 text-[9px] uppercase tracking-widest">
                  <span>Sync My Unit</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          <div className="p-6 md:p-10 bg-white/[0.01]">
            <div className="sticky top-16 md:top-24">
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 opacity-60 italic">
                  Availability Cluster
                </p>
                <div className="flex items-end gap-2">
                  <span
                    className={`text-3xl font-black ${
                      isSoldOut ? "text-rose-500" : "text-white"
                    }`}
                  >
                    {isSoldOut ? "VOID" : event.availableTickets}
                  </span>
                  {!isSoldOut && (
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1.5 italic">
                      Active Slots
                    </span>
                  )}
                </div>
              </div>

              {message && (
                <div
                  className={`p-4 mb-6 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
                    ticketId
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                        ticketId ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="4"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>{message}</span>
                  </div>
                  {ticketId && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/10 text-center">
                      <Link
                        href={`/tickets/${ticketId}`}
                        className="block w-full py-3 bg-white text-indigo-600 font-black rounded-xl transition-all shadow-xl shadow-white/5 uppercase tracking-widest"
                      >
                        Launch Ticket
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {!ticketId && !isSoldOut && !isExpired && (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 opacity-60">
                      Attendee Identity
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      name="name"
                      value={registrationData.name}
                      onChange={onChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white text-[10px] uppercase tracking-widest font-bold placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1 opacity-60">
                      Communication Port
                    </label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      name="email"
                      value={registrationData.email}
                      onChange={onChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white text-[10px] uppercase tracking-widest font-bold placeholder:text-gray-700"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {submitting ? "Connecting..." : "Initialize Access"}
                  </button>
                  <p className="text-[7px] text-center text-gray-700 font-black uppercase tracking-[0.3em] mt-4 italic">
                    Registry Encryption: AES-256
                  </p>
                </form>
              )}

              {(isSoldOut || isExpired) && !ticketId && (
                <div className="text-center p-6 border border-white/5 rounded-3xl bg-white/2">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-500/10">
                    <svg
                      className="w-6 h-6 text-rose-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] italic opacity-50">
                    {isExpired ? "Event Terminated" : "Cluster Exhausted"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}