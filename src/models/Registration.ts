import mongoose, { Schema, Document, Model } from "mongoose";
import type { IEvent } from "./Event";

export interface IRegistration extends Document {
  event: mongoose.Types.ObjectId | IEvent;
  name: string;
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Registration: Model<IRegistration> = mongoose.models.Registration || mongoose.model<IRegistration>("Registration", registrationSchema);

export default Registration;