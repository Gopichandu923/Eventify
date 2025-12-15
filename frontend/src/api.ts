import axios from "axios";

const api = axios.create({
  baseURL: "https://eventify-backend-flax.vercel.app/api",
});

// Helper for token header
const getConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const signUp = async (data: any) => {
  return await api.post("/auth/register", data);
};

export const logIn = async (data: any) => {
  return await api.post("/auth/login", data);
};

export const createEvent = async (data: any, token: string) => {
  return await api.post("/events", data, getConfig(token));
};

export const getAllEvents = async () => {
  return await api.get("/events/all");
};

export const getMyEvents = async (token: string) => {
  return await api.get("/events", getConfig(token));
};

export const getEventDetails = async (id: string) => {
  return await api.get(`/events/${id}`);
};

export const getEventRegistrations = async (id: string, token: string) => {
  return await api.get(`/events/${id}/registrations`, getConfig(token));
};

export const registerForEvent = async (data: any) => {
  return await api.post(`/registrations`, data);
};

export const getTicketDetails = async (ticketId: string) => {
  return await api.get(`/registrations/tickets/${ticketId}`);
};
export const getTicketId = async (eventId: string, email: string) => {
  return await api.get(`/registrations/tickets/${eventId}/lookup/${email}`);
};

export const updateRegistrationStatus = async (
  id: string,
  data: { status: "Approved" | "Rejected" },
  token: string
) => {
  return await api.put(`/registrations/${id}/status`, data, getConfig(token));
};
