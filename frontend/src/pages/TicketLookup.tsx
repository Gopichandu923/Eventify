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
      navigate(`/tickets/${res.data.ticketId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Could not find a ticket for this email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-3xl rounded-xl border-t-4 border-indigo-500 transform hover:shadow-4xl transition duration-300">
      <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
        🔍 Retrieve Ticket
      </h2>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Enter the email used during registration for event:
        <span className="font-semibold">{eventId}</span>
      </p>
      {error && (
        <p className="mb-4 text-sm text-red-700 text-center bg-red-100 border border-red-300 p-3 rounded-lg animate-pulse">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Registration Email"
          required
          className="w-full p-4 border border-gray-300 rounded-xl transition duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-4 font-bold text-lg rounded-xl transition duration-300 shadow-md transform hover:shadow-lg ${
            loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? "Searching..." : "Retrieve Ticket"}
        </button>
      </form>
    </div>
  );
};

export default TicketLookup;
