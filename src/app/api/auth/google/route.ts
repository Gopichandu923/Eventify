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

    if (!credential) {
      return NextResponse.json({ message: "Missing credential" }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const name = payload.name || "Google User";
    const email = payload.email;

    if (!email) {
      return NextResponse.json({ message: "No email in token" }, { status: 401 });
    }

    let user = await User.findOne({ email });
    
    if (!user) {
      const randomPassword = Math.random().toString(36) + Math.random().toString(36);
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(randomPassword, 12),
      });
    }

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });

    const response = NextResponse.json(
      { user: { name: user.name, email: user.email }, token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google Login Error:", error);
    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 401 }
    );
  }
}