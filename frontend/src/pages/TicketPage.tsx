import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTicketDetails } from "../api";

// Assuming the API response structure is similar to this:
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
  event: EventDetails & { _id: string }; // Add _id for Event ID
}

const TicketPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setLoading(false);
        setError("Invalid ticket ID provided.");
        return;
      }
      try {
        const res = await getTicketDetails(ticketId); // Assumes API returns full TicketData
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
    // This triggers the browser's print/save as PDF dialogue
    window.print();
  };

  if (loading) {
    return <div className="text-center text-xl p-8">Loading ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-xl">
        <h2 className="text-4xl font-extrabold text-red-700 mb-4">
          Ticket Error
        </h2>
        <p className="text-center text-red-600 text-xl p-8">
          {error || "Ticket data could not be loaded."}
        </p>
      </div>
    );
  }

  // Determine status styling
  const statusColors = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };
  const statusClasses =
    statusColors[ticket.status] || "bg-gray-100 text-gray-700";

  // Extracting details for clear display
  const eventId = ticket.event._id;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-xl border-t-8 border-indigo-600">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Your Event Ticket
        </h2>
        <div
          className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider ${statusClasses}`}
        >
          Status: {ticket.status}
        </div>
      </div>

      {/* -------------------- DOWNLOAD/PRINT BUTTON -------------------- */}
      {ticket.status === "Approved" && (
        <div className="mb-8 text-center">
          <button
            onClick={handleDownload}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-lg flex items-center space-x-2 mx-auto print:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            <span>Download / Print Ticket</span>
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Use your browser's Print function to save as PDF.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border p-6 rounded-lg bg-gray-50">
        {/* User Details */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-1">
            Attendee Information
          </h3>
          <p className="text-gray-700 mb-2">
            <strong>Name:</strong> {ticket.name}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {ticket.email}
          </p>
        </div>

        {/* Event Details */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-1">
            Event Details
          </h3>
          <p className="text-gray-700 mb-2">
            <strong>Event Title:</strong> {ticket.event.title}
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

      {/* -------------------- UNIQUE IDENTIFIERS -------------------- */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-gray-600 font-medium mb-2">
          **Event ID:**{" "}
          <code className="bg-gray-200 p-1 rounded font-mono text-sm">
            {eventId}
          </code>
        </p>
        <p className="text-2xl font-bold text-indigo-700">
          **Ticket ID:**{" "}
          <code className="bg-indigo-100 px-3 py-1 rounded font-mono text-2xl tracking-widest">
            {ticketId}
          </code>
        </p>
        {/* Optional: Placeholder for a QR Code based on Ticket ID */}
        <div className="mt-4"></div>
      </div>
    </div>
  );
};

export default TicketPage;
