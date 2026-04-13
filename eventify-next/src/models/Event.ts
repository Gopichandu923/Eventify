import mongoose, { Schema, Document, Model } from "mongoose";
import type { IUser } from "./User";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  venue: string;
  ticketLimit: number;
  organizer: mongoose.Types.ObjectId | IUser;
  availableTickets: number;
  approvalMethod: "auto" | "manual";
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    ticketLimit: { type: Number, required: true, default: 0 },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    availableTickets: { type: Number, required: true, default: 0 },
    approvalMethod: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto",
      required: true,
    },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;