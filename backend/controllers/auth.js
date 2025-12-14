import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const generateJwt = (id) => {
  const payload = { user: { id: id } };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
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
    const token = generateJwt(newUser._id);
    return res.status(201).json({
      user: { name, email },
      token: token,
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
    const token = generateJwt(user._id);
    return res
      .status(200)
      .json({ user: { name: user.name, email }, token: token });
  } catch (error) {
    console.log("Error while creating new user :" + error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
