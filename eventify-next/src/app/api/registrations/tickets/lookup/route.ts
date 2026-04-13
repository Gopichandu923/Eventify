import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Registration from "@/models/Registration";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const email = searchParams.get("email");

    if (!eventId || !email) {
      return NextResponse.json(
        { message: "Please provide both Event ID and Email address for lookup." },
        { status: 400 }
      );
    }

    const ticket = await Registration.findOne({
      event: eventId,
      email: email,
    }).populate("event", "title description date venue");

    if (!ticket) {
      return NextResponse.json(
        { message: "No ticket found for this email and event. Please verify your details." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ticketId: ticket._id,
      name: ticket.name,
      email: ticket.email,
      status: ticket.status,
      message: ticket.status === "Approved"
        ? "Ticket found and ready for download."
        : `Ticket found. Current status: ${ticket.status}.`,
      event: ticket.event,
    });
  } catch (error) {
    console.error("Ticket Lookup Error:", error);
    return NextResponse.json(
      { message: "Server error while performing ticket lookup." },
      { status: 500 }
    );
  }
}