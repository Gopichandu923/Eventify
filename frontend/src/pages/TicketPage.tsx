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

  const statusColors: Record<string, string> = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  const statusClasses =
    statusColors[ticket.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-3xl mx-auto mt-10 relative">
      {/* Background decoration for premium feel */}
      <div className="absolute inset-0 bg-indigo-600 rounded-3xl transform rotate-1 opacity-10 -z-10"></div>
      <div className="absolute inset-0 bg-purple-600 rounded-3xl transform -rotate-1 opacity-10 -z-10"></div>

      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        {/* Left Side: Ticket Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
                ADMIT ONE
              </h2>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">
                Eventify Premium Ticket
              </p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${statusClasses}`}
            >
              {ticket.status}
            </span>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">
                Attendee
              </h3>
              <p className="text-xl font-bold text-gray-800">{ticket.name}</p>
              <p className="text-gray-500 text-sm truncate">{ticket.email}</p>
            </section>

            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">
                Event Information
              </h3>
              <p className="text-2xl font-black text-indigo-900 leading-tight mb-2">
                {ticket.event.title}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                    Date
                  </p>
                  <p className="font-bold text-gray-800">
                    {new Date(ticket.event.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                    Venue
                  </p>
                  <p className="font-bold text-gray-800 truncate">
                    {ticket.event.venue}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 flex items-center justify-between pt-6 border-t-2 border-dashed border-gray-200">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                Ticket ID
              </p>
              <p className="font-mono font-bold text-indigo-900 text-sm tracking-widest bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase">
                {ticketId?.slice(-12)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                Powered by
              </p>
              <p className="font-black text-indigo-600 text-lg italic">
                Eventify
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: QR Stub (Simulated Perforation) */}
        <div className="md:w-64 bg-gray-50 border-l-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center relative">
          {/* Punch holes for aesthetic ticket stub look */}
          <div className="hidden md:block absolute -top-4 left-[-9px] w-4 h-8 bg-gray-50 rounded-full border-2 border-gray-100"></div>
          <div className="hidden md:block absolute -bottom-4 left-[-9px] w-4 h-8 bg-gray-50 rounded-full border-2 border-gray-100"></div>

          <div className="bg-white p-4 rounded-3xl shadow-xl border-2 border-indigo-100 mb-4 transform hover:scale-105 transition-transform duration-300">
            <QRCodeSVG
              value={`${window.location.origin}/tickets/verify/${ticketId}`}
              size={120}
              level="H"
              includeMargin={false}
              className="rounded-lg"
              imageSettings={{
                src: "/vite.svg", // Using the existing vite logo as a center image
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
              Verify Entry
            </p>
            <p className="text-[8px] text-gray-300 font-mono break-all max-w-[120px]">
              {ticketId}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {ticket.status === "Approved" && (
        <div className="mt-8 flex justify-center items-center gap-4 print:hidden">
          <button
            onClick={handleDownload}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all hover:shadow-2xl active:scale-95 cursor-pointer uppercase tracking-widest text-sm"
          >
            <svg
              className="w-5 h-5 group-hover:animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Print Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketPage;
