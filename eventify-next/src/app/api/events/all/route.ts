import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error retrieving all events:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}