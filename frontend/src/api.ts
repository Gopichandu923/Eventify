import axios from "axios";

const api = axios.create({
  baseURL: "https://eventify-backend-flax.vercel.app/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url.includes("/auth/refresh");

    if (error.response && error.response.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      try {
        const { data } = await api.get("/auth/refresh");
        localStorage.setItem("token", data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        // Only redirect if we are not already on the auth page
        if (!window.location.pathname.includes("/auth")) {
          window.location.href = "/organizer/auth";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const signUp = (data: any) => api.post("/auth/register", data);
export const logIn = (data: any) => api.post("/auth/login", data);
export const createEvent = (data: any) => api.post("/events", data);
export const getAllEvents = () => api.get("/events/all");
export const getMyEvents = () => api.get("/events");
export const getEventDetails = (id: string) => api.get(`/events/${id}`);
export const getEventRegistrations = (id: string) => api.get(`/events/${id}/registrations`);
export const registerForEvent = (data: any) => api.post(`/registrations`, data);
export const getTicketDetails = (ticketId: string) => api.get(`/registrations/tickets/${ticketId}`);
export const getTicketId = (eventId: string, email: string) =>
  api.get(`/registrations/tickets/lookup/`, { params: { eventId, email } });

export const updateRegistrationStatus = (id: string, data: { status: "Approved" | "Rejected" }) =>
  api.put(`/registrations/${id}/status`, data);

export const googleAuth = (credential: string) => api.post("/auth/google", { credential });

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("organizerName");
  return api.post("/auth/logout");
};
