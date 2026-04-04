import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEventRegistrations, updateRegistrationStatus } from "../api";

interface Event {
  _id: string;
  title: string;
  approvalMethod: string;
}

interface Registration {
  _id: string;
  name: string;
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

const EventRegistrations: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<
    "all" | "Pending" | "Approved" | "Rejected"
  >("all");
  const token = localStorage.getItem("token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["registrations", eventId],
    queryFn: async () => {
      if (!token || !eventId) throw new Error("Missing credentials");
      const res = await getEventRegistrations(eventId);
      return res.data;
    },
    enabled: !!token && !!eventId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Approved" | "Rejected" }) => 
      updateRegistrationStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations", eventId] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Error updating status.");
    }
  });

  const event = data?.event as Event | null;
  const registrations = (Array.isArray(data?.registrations) ? data.registrations : []) as Registration[];

  const filteredRegistrations =
    filter === "all"
      ? registrations
      : registrations.filter((reg) => reg.status === filter);

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === "Pending").length,
    approved: registrations.filter((r) => r.status === "Approved").length,
    rejected: registrations.filter((r) => r.status === "Rejected").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0a0a0c]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Hydrating Registry...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#0a0a0c] px-4">
        <div className="text-center glass-card p-10 rounded-3xl border-rose-500/20 max-w-sm w-full">
           <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-500/10">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">Registry Link Failed</h3>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest leading-relaxed mb-8 opacity-60">
            {error instanceof Error ? error.message : "Access Denied"}
          </p>
          <Link
            to="/organizer/dashboard"
            className="inline-block w-full px-6 py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-100 transition-all shadow-xl shadow-white/5"
          >
            Direct Terminal Return
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-6 px-4 md:px-8 relative overflow-x-hidden bg-[#0a0a0c]">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full animate-pulse-slow -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <Link
            to="/organizer/dashboard"
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest group"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="hidden sm:inline">Command Hub</span>
          </Link>
          <div className="text-right">
            <h1 className="text-sm md:text-base font-black text-white italic truncate max-w-[150px] md:max-w-md uppercase tracking-tight">{event.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Units', value: stats.total, color: 'text-indigo-400' },
            { label: 'Queue', value: stats.pending, color: 'text-amber-400' },
            { label: 'Verified', value: stats.approved, color: 'text-emerald-400' },
            { label: 'Voids', value: stats.rejected, color: 'text-rose-400' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-3 md:p-4 rounded-xl md:rounded-2xl border-white/5 flex items-center justify-between group">
              <div>
                <p className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                <span className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${stat.color.replace('text', 'bg')} animate-pulse`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-white/10 shadow-2xl">
          <div className="p-4 md:p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest italic opacity-60">Registry Database</h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All', count: stats.total },
                { id: 'Pending', label: 'Pending', count: stats.pending },
                { id: 'Approved', label: 'Verified', count: stats.approved },
                { id: 'Rejected', label: 'Voids', count: stats.rejected }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${filter === f.id
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "bg-white/5 text-gray-500 hover:text-white"
                    }`}
                >
                  {f.label} • {f.count}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white/[0.01]">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">Identity Registry</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">Mail Port</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 text-center">Status</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <p className="text-gray-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic opacity-50">Empty Node Registry</p>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-4 md:px-6 py-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-indigo-500/50 to-purple-500/50 rounded-lg flex items-center justify-center text-white font-black text-[9px] md:text-[10px]">
                            {reg.name.charAt(0)}
                          </div>
                          <span className="text-[10px] md:text-xs font-black text-gray-200 uppercase tracking-widest truncate max-w-[80px] md:max-w-[120px]">{reg.name}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <span className="text-[9px] md:text-[10px] text-gray-600 font-black uppercase tracking-widest truncate max-w-[100px] md:max-w-[150px] block opacity-60 italic">{reg.email}</span>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-center">
                        <div className={`px-2 py-0.5 rounded text-[7px] md:text-[8px] font-black uppercase tracking-widest inline-block ${reg.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                          reg.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                          {reg.status}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-right">
                        {event.approvalMethod === "manual" && reg.status === "Pending" ? (
                          <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: reg._id, status: "Approved" })}
                              disabled={updateStatusMutation.isPending}
                              className="px-2 md:px-3 py-1 md:py-1.5 bg-white text-indigo-600 text-[7px] md:text-[8px] font-black rounded-lg hover:bg-neutral-100 transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: reg._id, status: "Rejected" })}
                              disabled={updateStatusMutation.isPending}
                              className="px-2 md:px-3 py-1 md:py-1.5 bg-rose-500 text-white text-[7px] md:text-[8px] font-black rounded-lg hover:bg-rose-400 transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                              Void
                            </button>
                          </div>
                        ) : (
                          <span className="text-[7px] md:text-[8px] font-black text-gray-700 uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity italic">
                            STABLE_UNIT_X1
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center opacity-20 pb-4">
          <p className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-[0.5em] italic">Data parity verified via Node Cluster x84</p>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;
