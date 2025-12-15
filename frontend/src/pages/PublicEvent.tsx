import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventDetails, registerForEvent } from "../api";
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  approvalMode: "auto" | "manual";
  availableTickets: number;
}
const PublicEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        setMessage("Invalid event ID provided.");
        return;
      }
      try {
        const res = await getEventDetails(id);
        setEvent(res.data);
        setMessage(null);
      } catch (err: any) {
        setMessage(
          err.response?.data?.message ||
            err.message ||
            "Event not found or server error."
        );
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value,
    });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !event) return;
    try {
      const res = await registerForEvent({ eventId: id, ...registrationData });
      const { ticketId, status } = res.data;
      const statusMsg =
        status === "Approved"
          ? 'Your ticket is immediately "Approved"!'
          : 'Your registration is "Pending" until the organizer takes action.';
      setMessage(
        `Registration successful! ${statusMsg} Please use the download link below.`
      );
      setTicketId(ticketId);
    } catch (err: any) {
      setMessage(
        "Registration failed: " +
          (err.response?.data?.message ||
            err.response?.data?.msg ||
            "Server error.")
      );
      setTicketId(null);
    }
  };
  if (loading)
    return (
      <div className="text-center text-xl p-8">Loading event details...</div>
    );
  if (!event)
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-xl">
        <h2 className="text-4xl font-extrabold text-red-700 mb-4">Error</h2>
        <p className="text-center text-red-600 text-xl p-8">
          {message || "Event data could not be loaded."}
        </p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go to Home
        </Link>
      </div>
    );
  const isSoldOut = event.availableTickets <= 0;
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-xl">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">
        {event.title}
      </h2>
      <p className="text-gray-700 mb-2">
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Venue:</strong> {event.venue}
      </p>
      <p className="text-gray-600 mb-6">{event.description}</p>
      <p
        className={`text-lg font-bold mb-6 ${
          isSoldOut ? "text-red-600" : "text-green-600"
        }`}
      >
        Tickets:{" "}
        {isSoldOut ? "SOLD OUT" : event.availableTickets + " available"}
      </p>
      <hr className="mb-6" />
      {message && (
        <p
          className={`p-3 mb-4 rounded-lg font-medium ${
            ticketId ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </p>
      )}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Download Your Ticket
        </h3>
        <p className="text-gray-600 mb-4">
          Already registered? Click the button below to retrieve your ticket by
          email at any time.
        </p>
        <Link to={`/events/${id}/tickets`} className="inline-block">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md flex items-center space-x-2 mx-auto">
            <svg
              className="w-5 h-5"
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
            <span>Find & Download Ticket</span>
          </button>
        </Link>
      </div>
      {ticketId ? (
        <div className="mt-4 text-center text-sm text-gray-500">
          Your Registration ID is:{" "}
          <code className="bg-gray-200 p-1 rounded font-mono font-bold">
            {ticketId}
          </code>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Register Now (Mode: {event.approvalMode?.toUpperCase() || "N/A"})
          </h3>
          {isSoldOut ? (
            <p className="text-red-500 font-bold p-3 bg-red-50 rounded">
              Sorry, this event is sold out.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={registrationData.name}
                onChange={onChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={registrationData.email}
                onChange={onChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
              >
                Register
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
export default PublicEvent;
