import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // 1. Set up connection event listeners first
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      // Keep process running, but log the critical error
      console.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected. Attempting to reconnect...");
    });

    // 2. Close connection on process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to app termination");
      process.exit(0);
    });

    // 3. Perform the initial connection
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log initial success after connection promise resolves
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Initial MongoDB connection failed: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
