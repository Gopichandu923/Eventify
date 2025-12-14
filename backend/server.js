import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connect from "./config/db.js";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import registrationRoutes from "./routes/registration.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connect();

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

const PORT = process.env.PORT_NUM || 5000;

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to Event ticketing app.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
