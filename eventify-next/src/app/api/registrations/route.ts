import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

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

    const status = event.approvalMethod === "auto" ? "Approved" : "Pending";
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