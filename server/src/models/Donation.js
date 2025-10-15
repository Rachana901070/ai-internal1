import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    photo: { type: String },
    expiresAt: { type: Date, required: true },
    address: { type: String, required: true },
    geo: {
      lat: Number,
      lng: Number
    },
    status: {
      type: String,
      enum: ["OPEN", "MATCHED", "COMPLETED", "PENDING"],
      default: "OPEN"
    },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
