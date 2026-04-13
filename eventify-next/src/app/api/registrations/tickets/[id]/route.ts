import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Registration from "@/models/Registration";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || id === "undefined" || id === "null") {
      return NextResponse.json(
        { message: "Invalid ticket ID provided." },
        { status: 400 }
      );
    }

    const ticket = await Registration.findById(id).populate(
      "event",
      "title description date venue"
    );

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket record not found. Please register again or contact support." },
        { status: 404 }
      );
    }

    if (ticket.status !== "Approved") {
      return NextResponse.json(
        {
          message: `Your registration status is currently "${ticket.status}". Tickets are only available for viewing after organizer approval.`,
          status: ticket.status,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ticketId: ticket._id,
      name: ticket.name,
      email: ticket.email,
      status: ticket.status,
      event: ticket.event,
    });
  } catch (error) {
    if ((error as { name?: string }).name === "CastError") {
      return NextResponse.json(
        { message: "Invalid Ticket ID format. Please check your link." },
        { status: 400 }
      );
    }
    console.error("Ticket Fetch Error:", error);
    return NextResponse.json(
      { message: "Server error while fetching ticket details." },
      { status: 500 }
    );
  }
}