import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickupTime: { type: Date, required: true },
    acceptedAt: { type: Date },
    status: { type: String, enum: ["ASSIGNED", "COMPLETED"], default: "ASSIGNED" }
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
