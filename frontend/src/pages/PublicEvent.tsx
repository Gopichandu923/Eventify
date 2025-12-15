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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-10 shadow-2xl rounded-2xl text-center">
          <svg
            className="w-20 h-20 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-4xl font-extrabold text-red-700 mb-4">
            Event Not Found
          </h2>
          <p className="text-red-600 text-lg mb-6">
            {message || "Event data could not be loaded."}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = event.availableTickets <= 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h2 className="text-4xl font-extrabold mb-2">{event.title}</h2>
          <div className="flex flex-wrap gap-4 text-indigo-100">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>{event.venue}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {event.description}
          </p>

          <div
            className={`inline-block px-6 py-3 rounded-full font-bold text-lg mb-6 ${
              isSoldOut
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isSoldOut
              ? "SOLD OUT"
              : `${event.availableTickets} tickets available`}
          </div>

          {message && (
            <div
              className={`p-4 mb-6 rounded-xl font-medium flex items-start ${
                ticketId
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <svg
                className="w-6 h-6 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {ticketId ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                )}
              </svg>
              <span>{message}</span>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download Your Ticket
            </h3>
            <p className="text-gray-700 mb-4">
              Already registered? Click the button below to retrieve your ticket
              by email at any time.
            </p>
            <Link to={`/events/${id}/tickets`}>
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-700 mb-2">Your Registration ID:</p>
              <code className="text-lg bg-white px-4 py-2 rounded-lg font-mono font-bold text-indigo-600 border border-indigo-200 inline-block">
                {ticketId}
              </code>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Register Now
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    event.approvalMode === "auto"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.approvalMode === "auto"
                    ? "Instant Approval"
                    : "Manual Approval"}
                </span>
              </div>

              {isSoldOut ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <svg
                    className="w-16 h-16 text-red-500 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <p className="text-red-700 font-bold text-lg">
                    Sorry, this event is sold out.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      name="name"
                      value={registrationData.name}
                      onChange={onChange}
                      required
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={registrationData.email}
                      onChange={onChange}
                      required
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Register for Event
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicEvent;
