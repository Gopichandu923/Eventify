import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../api";

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  availableTickets: number;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        setEvents(res.data);
      } catch (err) {
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="text-center text-xl p-8">Loading public events...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 text-xl p-8">Error: {error}</div>
    );

  return (
    <div className="max-w-4xl mx-auto">
           {" "}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                Upcoming Events      {" "}
      </h1>
           {" "}
      {events.length === 0 ? (
        <p className="text-gray-600 text-lg">
                    No upcoming events available at the moment.        {" "}
        </p>
      ) : (
        <div className="space-y-6">
                   {" "}
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition duration-300"
            >
                           {" "}
              <h3 className="text-2xl font-semibold text-indigo-700 mb-2">
                                {event.title}             {" "}
              </h3>
                           {" "}
              <p className="text-gray-600">
                                <span className="font-medium">Date:</span>      
                          {new Date(event.date).toLocaleDateString()}           
                 {" "}
              </p>
                           {" "}
              <p className="text-gray-600 mb-4">
                                <span className="font-medium">Venue:</span>{" "}
                {event.venue}             {" "}
              </p>
                           {" "}
              <p
                className={`text-sm font-bold ${
                  event.availableTickets > 0 ? "text-green-600" : "text-red-600"
                } mb-4`}
              >
                                Tickets:                {" "}
                {event.availableTickets > 0
                  ? `${event.availableTickets} available`
                  : "SOLD OUT"}
                             {" "}
              </p>
                           {" "}
              <Link to={`/event/${event._id}`}>
                               {" "}
                <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
                                    View Details & Register                {" "}
                </button>
                             {" "}
              </Link>
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

export default Home;
