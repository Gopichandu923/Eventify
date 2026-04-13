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

export async function GET(
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

    const registrations = await Registration.find({ event: id });
    return NextResponse.json({ event, registrations }, { status: 200 });
  } catch (error) {
    console.error("Error getting registrations:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}