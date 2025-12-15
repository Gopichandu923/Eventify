import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyEvents } from "../api";

interface Event {
  _id: string;
  title: string;
  date: string;
  approvalMethod: string;
  availableTickets: number;
}

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const organizerName: string | null = localStorage.getItem("organizerName");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        setLoading(false);
        navigate("/organizer/auth");
        return;
      }
      try {
        const res = await getMyEvents(token);
        setEvents(res.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch your events. Token might be expired."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("organizerName");
    navigate("/organizer/auth");
  };

  if (loading)
    return <div className="text-center text-xl p-8">Loading dashboard...</div>;

  if (error && events.length === 0) {
    return (
      <div className="text-center text-xl p-8">
                <p className="text-red-600 mb-4">{error}</p>       {" "}
        <Link to="/organizer/auth" className="text-blue-500 hover:underline">
                    Login        {" "}
        </Link>
             {" "}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
           {" "}
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
               {" "}
        <h1 className="text-3xl font-bold text-gray-800">
                    Welcome, {organizerName || "Organizer"}       {" "}
        </h1>
               {" "}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
        >
                    Logout        {" "}
        </button>
             {" "}
      </div>
           {" "}
      <div className="flex justify-between items-center mb-6">
               {" "}
        <h3 className="text-2xl font-semibold text-gray-700">
                    Your Created Events        {" "}
        </h3>
               {" "}
        <Link to="/organizer/create-event">
                   {" "}
          <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
                        Create New Event          {" "}
          </button>
                 {" "}
        </Link>
               {" "}
      </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>} 
         {" "}
      {events.length === 0 ? (
        <p className="text-gray-600 text-lg p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    You have not created any events yet.        {" "}
        </p>
      ) : (
        <div className="space-y-4">
                   {" "}
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-xl p-5 flex justify-between items-center border border-gray-100"
            >
                           {" "}
              <div>
                               {" "}
                <h4 className="text-xl font-bold text-gray-900">
                                    {event.title}               {" "}
                </h4>
                               {" "}
                <p className="text-sm text-gray-600">
                                    Date:{" "}
                  {new Date(event.date).toLocaleDateString()}               {" "}
                </p>
                               {" "}
                <p className="text-sm text-gray-600">
                                    Tickets Left: {event.availableTickets}     
                           {" "}
                </p>
                               {" "}
                <p className="text-sm font-medium">
                                    Approval Mode:                  {" "}
                  <span
                    className={`font-semibold ${
                      event.approvalMethod === "manual"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                                       {" "}
                    {event.approvalMethod?.toUpperCase() || "N/A"}             
                       {" "}
                  </span>
                                 {" "}
                </p>
                             {" "}
              </div>
                           {" "}
              <div className="space-x-4">
                               {" "}
                <Link
                  to={`/events/${event._id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                                    Public Link                {" "}
                </Link>
                               {" "}
                <Link
                  to={`/organizer/registrations/${event._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
                >
                                    Manage Registrations                {" "}
                </Link>
                             {" "}
              </div>
                         {" "}
            </div>
          ))}
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default OrganizerDashboard;
