import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    const user = await UserModel.find({ email: email });
    if (user) {
      res.status(400).json({
        message: "User already exist with this email.Signup with new email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);
    const newUser = new UserModel({ name, email, hashedPassword });
    await newUser.save();
    const token = generateJwt(newUser._id);
    res
      .status(201)
      .json({ message: "Successfully ", user: { name, email }, token: token });
  } catch (error) {
    console.log("Error while creating new user :" + error);
    res.status(500).json({ message: "Internal server error." });
  }
};
