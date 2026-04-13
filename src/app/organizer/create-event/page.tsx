"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/api";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    ticketLimit: 50,
    approvalMethod: "auto",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = {
      ...formData,
      approvalMode: formData.approvalMethod,
      ticketLimit: Number(formData.ticketLimit),
    };

    try {
      await createEvent(dataToSend);
      alert("Event created successfully!");
      router.push("/organizer/dashboard");
    } catch (err: Error | unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error creating event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2 md:py-4 px-4 pb-12">
      <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-white/5">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 md:p-8 text-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16"></div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1 uppercase italic">DEPLOY EVENT</h2>
          <p className="text-indigo-100/70 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Initialization Protocol</p>
        </div>

        <div className="p-5 md:p-10">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-3 animate-pulse">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Global Tech Summit 2026"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-gray-600 text-sm"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Strategic Description</label>
                <textarea
                  placeholder="Describe your event's unique value proposition..."
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-gray-600 text-sm resize-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Launch Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white color-scheme-dark text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Vessel/Hall</label>
                <input
                  type="text"
                  placeholder="e.g. Meta Arena / NY Hall"
                  name="venue"
                  value={formData.venue}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-gray-600 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Capacity Cluster</label>
                <input
                  type="number"
                  placeholder="50"
                  name="ticketLimit"
                  value={formData.ticketLimit}
                  onChange={onChange}
                  required
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-gray-600 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Approval Protocol</label>
                <select
                  name="approvalMethod"
                  value={formData.approvalMethod}
                  onChange={onChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white appearance-none cursor-pointer text-sm"
                >
                  <option value="auto" className="bg-slate-900">⚡ Automatic (Instant)</option>
                  <option value="manual" className="bg-slate-900">⏳ Manual (Verified)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 md:pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 md:py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm md:text-xl rounded-xl md:rounded-2xl transition-all shadow-xl shadow-indigo-600/30 transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group uppercase tracking-widest"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs">Initializing...</span>
                  </div>
                ) : (
                  <>
                    <span>Initialize Event</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}