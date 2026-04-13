import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

function getUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  
  const [, token] = authHeader.split(" ");
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string } };
    return decoded.user.id;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const event = await Event.findOne({ _id: id }).select("-organizer");
    if (!event) {
      return NextResponse.json(
        { message: `Event not found with id ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error getting event details:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: "Please provide token in format 'Bearer <Token>'." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { title, description, date, venue, ticketLimit, approvalMode } = await request.json();

    const event = await Event.findOne({ _id: id });

    if (!event || event.organizer.toString() !== userId) {
      return NextResponse.json(
        { message: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    const oldTicketLimit = event.ticketLimit;
    const ticketDiff = Number(ticketLimit) - oldTicketLimit;
    
    if (ticketDiff < 0 && Math.abs(ticketDiff) > event.availableTickets) {
      return NextResponse.json(
        { message: "Cannot reduce ticket limit below current registrations." },
        { status: 400 }
      );
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.venue = venue || event.venue;
    event.ticketLimit = Number(ticketLimit) || event.ticketLimit;
    event.approvalMode = approvalMode || event.approvalMode;
    event.availableTickets = event.availableTickets + ticketDiff;

    await event.save();

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: "Please provide token in format 'Bearer <Token>'." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const event = await Event.findOne({ _id: id });

    if (!event || event.organizer.toString() !== userId) {
      return NextResponse.json(
        { message: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    const hasRegistrations = await Registration.exists({ event: id, status: "Approved" });
    if (hasRegistrations) {
      return NextResponse.json(
        { message: "Cannot delete event with approved registrations." },
        { status: 400 }
      );
    }

    await Registration.deleteMany({ event: id });
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}