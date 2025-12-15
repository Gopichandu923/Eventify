import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTicketId } from "../api";
const TicketLookup: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      const { ticketId } = res.data;
      navigate(`/tickets/${ticketId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Could not find a ticket with that email for this event."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Find Your Ticket
      </h2>
      <p className="text-center text-gray-600 mb-4">
        Enter the email used for registration to retrieve your ticket.
      </p>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center p-2 bg-red-50 rounded">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Registration Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 p-3 font-semibold rounded-lg transition duration-150 ${
            loading
              ? "bg-indigo-300"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? "Searching..." : "Retrieve Ticket"}
        </button>
      </form>
      <p className="mt-6 text-sm text-gray-500 text-center">
        Event ID: {eventId}
      </p>
    </div>
  );
};
export default TicketLookup;
