import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { credential } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const name = payload?.name || "";
    const email = payload?.email || "";

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
    }

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json(
      { user: { name: user.name, email: user.email }, token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Login Error:", error);
    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 401 }
    );
  }
}