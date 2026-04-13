import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please provide email and password." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("name password");
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 400 }
      );
    }

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json(
      { user: { name: user.name, email: user.email }, token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}