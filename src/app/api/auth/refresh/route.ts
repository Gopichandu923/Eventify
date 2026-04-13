import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "fallback-refresh-secret");
    const accessToken = jwt.sign({ user: { id: (decoded as { user: { id: string } }).user.id } }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ token: accessToken }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
  }
}