import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api";

const CreateEvent: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    ticketLimit: 50,
    approvalMethod: "auto",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token missing. Please log in again.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      approvalMode: formData.approvalMethod,
      ticketLimit: Number(formData.ticketLimit),
    };

    try {
      await createEvent(dataToSend, token);
      alert("Event created successfully!");
      navigate("/organizer/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
           {" "}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
                Create New Event        {" "}
      </h2>
           {" "}
      {error && (
        <p className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded">
                    {error}       {" "}
        </p>
      )}
           {" "}
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
               {" "}
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
               {" "}
        <textarea
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={onChange}
          required
          rows={4}
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
                <label className="font-medium text-gray-700">Date:</label>     
         {" "}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={onChange}
          required
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
               {" "}
        <input
          type="text"
          placeholder="Venue"
          name="venue"
          value={formData.venue}
          onChange={onChange}
          required
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
               {" "}
        <label className="font-medium text-gray-700">Ticket Limit:</label>     
         {" "}
        <input
          type="number"
          placeholder="Ticket Limit"
          name="ticketLimit"
          value={formData.ticketLimit}
          onChange={onChange}
          required
          min="1"
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
               {" "}
        <label className="font-medium text-gray-700">Approval Mode:</label>     
         {" "}
        <select
          name="approvalMethod"
          value={formData.approvalMethod}
          onChange={onChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
                    <option value="auto">Automatic (Auto-approval)</option>     
              <option value="manual">Manual (Organizer approves)</option>       {" "}
        </select>
               {" "}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 p-3 font-semibold rounded-lg transition duration-150 ${
            loading
              ? "bg-indigo-300"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
                    {loading ? "Creating..." : "Create Event"}       {" "}
        </button>
             {" "}
      </form>
         {" "}
    </div>
  );
};

export default CreateEvent;
