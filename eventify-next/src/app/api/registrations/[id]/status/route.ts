import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
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
    const { status } = await request.json();

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status provided." },
        { status: 400 }
      );
    }

    const registration = await Registration.findById(id).populate("event");

    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found." },
        { status: 404 }
      );
    }

    const event = registration.event as { organizer: { toString: () => string }; approvalMethod: string };
    
    if (event.organizer.toString() !== userId) {
      return NextResponse.json(
        { message: "Unauthorized action." },
        { status: 401 }
      );
    }

    if (event.approvalMethod !== "manual") {
      return NextResponse.json(
        { message: "Status change allowed only for manual approval events." },
        { status: 400 }
      );
    }

    registration.status = status as "Approved" | "Rejected";
    await registration.save();

    return NextResponse.json(
      { message: "Successfully updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}