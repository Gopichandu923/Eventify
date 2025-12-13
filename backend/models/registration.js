import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: { type: String, require: true },
    email: { name: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      required: true,
    },
    tickedId: {
      type: String,
      unique: true,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);
