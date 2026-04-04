import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (id) => {
  const payload = { user: { id: id } };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const generateRefreshToken = (id) => {
  const payload = { user: { id: id } };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matches REFRESH_TOKEN_EXPIRY
  });
};

//POST method for user signup
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(401)
      .json({ message: "Please provide name , email and password." });
  }
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.Signup with new email.",
      });
    }
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    setRefreshTokenCookie(res, refreshToken);
    return res.status(201).json({
      user: { name, email },
      token: accessToken,
    });
  } catch (error) {
    console.log("Error while creating new user :" + error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//POST user signin
export const signinUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Please provide email and password." });
  }
  try {
    const user = await UserModel.findOne(
      { email: email },
      { name: 1, password: 1 }
    );
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);
    return res
      .status(200)
      .json({ user: { name: user.name, email }, token: accessToken });
  } catch (error) {
    console.log("Error while creating new user :" + error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// GET refresh token
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(decoded.user.id);
    return res.status(200).json({ token: accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// POST logout
export const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

// POST google login
export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();

    let user = await UserModel.findOne({ email });
    if (!user) {
      // Create a user if they don't exist
      // Password can be random or null if the DB allows it
      user = new UserModel({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      user: { name: user.name, email },
      token: accessToken,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
};
