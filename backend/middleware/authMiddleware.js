import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  const header = req.headers["authorization"];
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(400).json({
      message: "Please provide token in this format 'Bearer <Token>' .",
    });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Token expired .Please login again." });
    }
    return res.status(400).json({ message: error.message });
  }
};
