import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const getStatusColor = (status: Registration["status"]) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const fetchRegistrations = async () => {
    if (!token || !eventId) {
      setError("Missing event ID or authorization token.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getEventRegistrations(eventId, token);
      setEvent(res.data.event);
      setRegistrations(res.data.registrations);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Could not load registrations or unauthorized."
      );
      setEvent(null);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [eventId, token]);

  const handleUpdateStatus = async (
    registrationId: string,
    newStatus: "Approved" | "Rejected"
  ) => {
    if (!token) return;
    try {
      await updateRegistrationStatus(
        registrationId,
        { status: newStatus },
        token
      );
      fetchRegistrations();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Error updating status. Check API console."
      );
    }
  };

  if (loading)
    return (
      <div className="text-center text-xl p-8">Loading registrations...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 text-xl p-8">Error: {error}</div>
    );
  if (!event)
    return (
      <div className="text-center text-xl p-8">
                Event not found or access denied.      {" "}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 shadow-xl rounded-lg">
           {" "}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h2> 
         {" "}
      <p className="text-lg text-gray-600 mb-6">
                Approval Mode:        {" "}
        <span
          className={`font-semibold ml-2 ${
            event.approvalMethod === "manual"
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
                    {event.approvalMethod.toUpperCase()}       {" "}
        </span>
             {" "}
      </p>
           {" "}
      <div className="mb-4">
               {" "}
        <span className="font-medium text-gray-700">Total Registrations:</span>{" "}
                {registrations.length}     {" "}
      </div>
           {" "}
      {registrations.length === 0 ? (
        <p className="text-gray-600 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    No registrations yet.        {" "}
        </p>
      ) : (
        <div className="overflow-x-auto">
                   {" "}
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                       {" "}
            <thead className="bg-gray-50">
                           {" "}
              <tr>
                               {" "}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                    Name                {" "}
                </th>
                               {" "}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                    Email                {" "}
                </th>
                               {" "}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                    Status                {" "}
                </th>
                               {" "}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action                {" "}
                </th>
                             {" "}
              </tr>
                         {" "}
            </thead>
                       {" "}
            <tbody className="bg-white divide-y divide-gray-200">
                           {" "}
              {registrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-50">
                                   {" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                        {reg.name}                 {" "}
                  </td>
                                   {" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-r">
                                        {reg.email}                 {" "}
                  </td>
                                   {" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm border-r">
                                       {" "}
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        reg.status
                      )}`}
                    >
                                            {reg.status}                   {" "}
                    </span>
                                     {" "}
                  </td>
                                   {" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                       {" "}
                    {event.approvalMethod === "manual" &&
                    reg.status === "Pending" ? (
                      <div className="flex space-x-2">
                                               {" "}
                        <button
                          onClick={() =>
                            handleUpdateStatus(reg._id, "Approved")
                          }
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition duration-150"
                        >
                                                    Approve                    
                             {" "}
                        </button>
                                               {" "}
                        <button
                          onClick={() =>
                            handleUpdateStatus(reg._id, "Rejected")
                          }
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition duration-150"
                        >
                                                    Reject                      
                           {" "}
                        </button>
                                             {" "}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">
                                               {" "}
                        {event.approvalMethod === "auto"
                          ? "Auto-Approved"
                          : "Final Status"}
                                             {" "}
                      </span>
                    )}
                                   {" "}
                  </td>
                                 {" "}
                </tr>
              ))}
                         {" "}
            </tbody>
                     {" "}
          </table>
                 {" "}
        </div>
      )}
            <p className="mt-8 text-sm text-gray-500">Event ID: {eventId}</p>   {" "}
    </div>
  );
};

export default EventRegistrations;
