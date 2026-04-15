"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string } };
    return decoded.user.id;
  } catch {
    return null;
  }
}

export async function getAllEvents() {
  const { default: Event } = await import("@/models/Event");
  await connectDB();
  const events = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 });
  return events.map((e: any) => ({
    _id: e._id.toString(),
    title: e.title,
    description: e.description,
    date: e.date.toISOString(),
    venue: e.venue,
    ticketLimit: e.ticketLimit,
    availableTickets: e.availableTickets,
    approvalMode: e.approvalMode,
  }));
}

export async function getMyEvents() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  
  const { default: Event } = await import("@/models/Event");
  await connectDB();
  const events = await Event.find({ organizer: userId }).sort({ date: 1 });
  return events.map((e: any) => ({
    _id: e._id.toString(),
    title: e.title,
    description: e.description,
    date: e.date.toISOString(),
    venue: e.venue,
    ticketLimit: e.ticketLimit,
    availableTickets: e.availableTickets,
    approvalMode: e.approvalMode,
  }));
}

export async function getEventDetails(id: string) {
  const { default: Event } = await import("@/models/Event");
  await connectDB();
  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");
  return {
    _id: event._id.toString(),
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    venue: event.venue,
    ticketLimit: event.ticketLimit,
    availableTickets: event.availableTickets,
    approvalMode: event.approvalMode,
  };
}

export async function createEvent(data: {
  title: string;
  description: string;
  date: string;
  venue: string;
  ticketLimit: number;
  approvalMode: "auto" | "manual";
}) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  
  const { default: Event } = await import("@/models/Event");
  await connectDB();
  const event = await Event.create({
    title: data.title,
    description: data.description,
    date: new Date(data.date),
    venue: data.venue,
    ticketLimit: data.ticketLimit,
    approvalMode: data.approvalMode,
    organizer: new mongoose.Types.ObjectId(userId),
    availableTickets: data.ticketLimit,
  });
  
  return {
    _id: event._id.toString(),
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    venue: event.venue,
    ticketLimit: event.ticketLimit,
    availableTickets: event.availableTickets,
    approvalMode: event.approvalMode,
  };
}

export async function updateEvent(id: string, data: {
  title?: string;
  description?: string;
  date?: string;
  venue?: string;
  ticketLimit?: number;
  approvalMode?: "auto" | "manual";
}) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  
  const { default: Event } = await import("@/models/Event");
  await connectDB();
  
  const updateData: Record<string, unknown> = { ...data };
  if (data.date) updateData.date = new Date(data.date);
  
  const event: any = await Event.findOneAndUpdate(
    { _id: id, organizer: userId },
    updateData,
    { new: true }
  );
  if (!event) throw new Error("Event not found");
  
  return {
    _id: event._id.toString(),
    title: event.title,
    description: event.description,
    date: event.date?.toISOString?.() || event.date,
    venue: event.venue,
    ticketLimit: event.ticketLimit,
    availableTickets: event.availableTickets,
    approvalMode: event.approvalMode,
  };
}

export async function deleteEvent(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  
  const { default: Event } = await import("@/models/Event");
  await connectDB();
  await Event.findOneAndDelete({ _id: id, organizer: userId });
}

export async function getEventRegistrations(eventId: string) {
  const { default: Event } = await import("@/models/Event");
  const { default: Registration } = await import("@/models/Registration");
  await connectDB();
  const event: any = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");
  
  const registrations = await Registration.find({ event: eventId }).sort({ createdAt: -1 });
  
  return {
    event: {
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      venue: event.venue,
      ticketLimit: event.ticketLimit,
      availableTickets: event.availableTickets,
      approvalMode: event.approvalMode,
    },
    registrations: registrations.map((r: any) => ({
      _id: r._id.toString(),
      name: r.name,
      email: r.email,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function registerForEvent(data: { eventId: string; name: string; email: string }) {
  const { default: Event } = await import("@/models/Event");
  const { default: Registration } = await import("@/models/Registration");
  await connectDB();
  
  const event: any = await Event.findById(data.eventId);
  if (!event) throw new Error("Event not found");
  
  const existing = await Registration.findOne({ event: data.eventId, email: data.email });
  if (existing) throw new Error("Already registered with this email");
  
  const isAutoApprove = event.approvalMode === "auto";
  const hasSlots = event.availableTickets > 0;
  let finalStatus = "Pending";
  
  if (isAutoApprove && hasSlots) {
    const eventObjId = new mongoose.Types.ObjectId(data.eventId);
    await (Event as any).findOneAndUpdate(
      { _id: eventObjId, availableTickets: { $gt: 0 } },
      { $inc: { availableTickets: -1 } }
    );
    finalStatus = "Approved";
  }
  
  const eventObjId = new mongoose.Types.ObjectId(data.eventId);
  const registration: any = await (Registration as any).create({
    event: eventObjId,
    name: data.name,
    email: data.email,
    status: finalStatus,
  });
  
  return { ticketId: String(registration._id), status: finalStatus };
}

export async function getTicketDetails(ticketId: string) {
  const { default: Registration } = await import("@/models/Registration");
  await connectDB();
  
  const registration: any = await Registration.findById(ticketId).populate("event");
  if (!registration) throw new Error("Ticket not found");
  
  return {
    ticketId: registration._id.toString(),
    name: registration.name,
    email: registration.email,
    status: registration.status,
    event: {
      title: registration.event.title,
      date: registration.event.date.toISOString(),
      venue: registration.event.venue,
      _id: registration.event._id.toString(),
    },
  };
}

export async function getTicketId(eventId: string, email: string) {
  const { default: Registration } = await import("@/models/Registration");
  await connectDB();
  
  const registration: any = await Registration.findOne({ event: eventId, email });
  if (!registration) throw new Error("No ticket found for this email");
  
  return { ticketId: registration._id.toString() };
}

export async function updateRegistrationStatus(id: string, status: "Approved" | "Rejected") {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  
  const { default: Event } = await import("@/models/Event");
  const { default: Registration } = await import("@/models/Registration");
  await connectDB();
  const registration: any = await Registration.findById(id);
  if (!registration) throw new Error("Registration not found");
  
  const event: any = await Event.findById(registration.event);
  if (!event || event.organizer.toString() !== userId) {
    throw new Error("Not authorized");
  }
  
  if (status === "Approved") {
    const updated = await Event.findOneAndUpdate(
      { _id: event._id, availableTickets: { $gt: 0 } },
      { $inc: { availableTickets: -1 } }
    );
    
    if (!updated) {
      throw new Error("No tickets available");
    }
  }
  
  registration.status = status;
  await registration.save();
  
  return {
    _id: registration._id.toString(),
    name: registration.name,
    email: registration.email,
    status: registration.status,
  };
}