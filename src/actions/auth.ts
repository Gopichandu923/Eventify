"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function logIn(email: string, password: string) {
  await connectDB();
  
  const user = await User.findOne({ email }).select("name password");
  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });
  
  const cookieStore = await cookies();
  cookieStore.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

  return { name: user.name, email: user.email };
}

export async function signUp(name: string, email: string, password: string) {
  await connectDB();
  
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });
  
  const cookieStore = await cookies();
  cookieStore.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

  return { name: user.name, email: user.email };
}

export async function googleAuth(credential: string) {
  await connectDB();
  
  if (!credential) {
    throw new Error("Missing credential");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google token");
  }

  const { email, name } = payload;
  if (!email) {
    throw new Error("No email found in Google token");
  }

  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = Math.random().toString(36) + Math.random().toString(36);
    user = await User.create({
      name: name || "Google User",
      email,
      password: await bcrypt.hash(randomPassword, 12),
    });
  }

  const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, { expiresIn: "7d" });
  
  const cookieStore = await cookies();
  cookieStore.set("token", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { name: user.name, email: user.email };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string } };
    await connectDB();
    const user = await User.findById(decoded.user.id).select("name email");
    return user;
  } catch {
    return null;
  }
}