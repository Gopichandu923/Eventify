import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: "Please provide token in format 'Bearer <Token>'." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { message: "Please provide eventId." },
        { status: 400 }
      );
    }

    const event = await Event.findOne({ _id: eventId });
    if (!event || event.organizer.toString() !== userId) {
      return NextResponse.json(
        { message: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    const registrations = await Registration.find({ event: eventId });
    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    console.error("Error retrieving registrations:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, eventId } = await request.json();

    if (!name || !email || !eventId) {
      return NextResponse.json(
        { message: "Please provide name, email and eventId." },
        { status: 400 }
      );
    }

    const existingRegistration = await Registration.findOne({ event: eventId, email });
    if (existingRegistration) {
      return NextResponse.json(
        { message: "User already registered." },
        { status: 400 }
      );
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, availableTickets: { $gt: 0 } },
      { $inc: { availableTickets: -1 } },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { message: "Tickets are filled or event not found." },
        { status: 400 }
      );
    }

    const status = event.approvalMode === "auto" ? "Approved" : "Pending";
    const registration = await Registration.create({
      event: eventId,
      name,
      email,
      status,
    });

    return NextResponse.json(
      {
        ticketId: registration._id,
        status: registration.status,
        msg: "Registration submitted successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { message: "Duplicate registration detected." },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}