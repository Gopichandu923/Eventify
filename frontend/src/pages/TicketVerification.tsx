import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  event: EventDetails;
}

const TicketVerification: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyTicket = async () => {
      if (!ticketId) {
        setError("No ticket ID provided.");
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
          "This ticket is INVALID or does not exist in our system."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-xl font-bold text-gray-600 uppercase tracking-widest">Verifying Ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-red-500 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-4xl font-black text-red-700 mb-2">INVALID</h2>
          <p className="text-gray-600 font-medium mb-8">{error || "Verification Failed"}</p>
          <Link to="/" className="inline-block w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all uppercase tracking-widest">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = ticket.status === "Approved";

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 ${isApproved ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <div className={`bg-white p-10 rounded-3xl shadow-2xl border-4 ${isApproved ? 'border-green-500' : 'border-yellow-500'} text-center max-w-lg w-full transform transition-all hover:scale-105`}>
        
        {isApproved ? (
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        ) : (
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        ) }

        <h2 className={`text-5xl font-black mb-2 uppercase tracking-tighter ${isApproved ? 'text-green-700' : 'text-yellow-700'}`}>
          {isApproved ? 'VERIFIED' : 'PENDING'}
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Official Eventify Entry Result</p>

        <div className="space-y-4 mb-10 text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
           <div>
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Event</p>
            <p className="text-xl font-bold text-gray-900">{ticket.event.title}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Attendee Name</p>
            <p className="text-lg font-bold text-indigo-700">{ticket.name}</p>
            <p className="text-xs text-gray-400 truncate">{ticket.email}</p>
          </div>
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Date</p>
               <p className="font-bold text-gray-800">{new Date(ticket.event.date).toLocaleDateString()}</p>
            </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Ticket ID</p>
               <p className="font-mono font-bold text-gray-800 text-sm">...{ticketId?.slice(-8)}</p>
            </div>
          </div>
        </div>

        <button 
           onClick={() => window.location.reload()}
           className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm shadow-xl hover:shadow-indigo-200 mb-4"
        >
          Scan Next Ticket
        </button>
        
        <Link to="/organizer/dashboard" className="text-gray-400 hover:text-gray-600 font-bold uppercase tracking-widest text-xs">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default TicketVerification;
