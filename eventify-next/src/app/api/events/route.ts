import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import mongoose from "mongoose";

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

    const events = await Event.find({ organizer: userId });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error retrieving events:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: "Please provide token in format 'Bearer <Token>'." },
        { status: 401 }
      );
    }

    const { title, description, date, venue, ticketLimit, approvalMode } = await request.json();

    if (!title || !description || !date || !venue || !ticketLimit || !approvalMode) {
      return NextResponse.json(
        { message: "Please provide all details." },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      venue,
      ticketLimit,
      organizer: new mongoose.Types.ObjectId(userId),
      availableTickets: ticketLimit,
      approvalMethod: approvalMode,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error during event creation:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}