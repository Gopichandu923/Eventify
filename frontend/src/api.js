import axios from "axios";

const api = axios.create({
  baseURL: "https://eventify-backend-flax.vercel.app/api",
});

export const SignUp = async (data) => {
  return await api.post("/auth/register", data);
};

export const LogIn = async (data) => {
  return await api.post("/auth/login", data);
};

export const CreateEvent = async (data, token) => {
  return await api.post("/events", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetAllEvents = async () => {
  return await api.get("/events/all");
};

export const GetMyEvents = async (token) => {
  return await api.get("/events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const GetEventDetails = async (id) => {
  return await api.get(`/events/${id}`);
};

export const GetEventRegistrations = async (id, token) => {
  return await api.get(`/events/${id}/registrations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const RegisterForEvent = async (id, data) => {
  return await api.post(`/registrations`, { eventId: id, ...data });
};
export const GetTicketDetails = async (id) => {
  return await api.get(`/registrations/ticket/${id}`);
};
export const UpdateRegistrationStatus = async (id, data, token) => {
  return await api.put(`/registrations/${id}/status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
