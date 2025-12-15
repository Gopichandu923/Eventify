import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTicketDetails } from "../api";

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
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-xl border-t-8 border-indigo-600">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Your Event Ticket
        </h2>
        <span
          className={`px-4 py-2 rounded-full font-bold uppercase tracking-wide ${statusClasses}`}
        >
          {ticket.status}
        </span>
      </div>

      {ticket.status === "Approved" && (
        <div className="mb-8 text-center print:hidden">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Download / Print Ticket
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Use your browser’s print option to save as PDF.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 border rounded-lg p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
            Attendee Information
          </h3>
          <p className="text-gray-700 mb-2">
            <strong>Name:</strong> {ticket.name}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {ticket.email}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
            Event Details
          </h3>
          <p className="text-gray-700 mb-2">
            <strong>Title:</strong> {ticket.event.title}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Date:</strong>{" "}
            {new Date(ticket.event.date).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>Venue:</strong> {ticket.event.venue}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t text-center">
        <p className="text-gray-600 font-medium mb-2">
          Event ID:
          <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm font-mono">
            {ticket.event._id}
          </code>
        </p>
        <p className="text-xl font-bold text-indigo-700">
          Ticket ID:
          <code className="ml-2 bg-indigo-100 px-3 py-1 rounded font-mono tracking-widest">
            {ticketId}
          </code>
        </p>
      </div>
    </div>
  );
};

export default TicketPage;
