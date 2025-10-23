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
    geo: { lat: { type: Number }, lng: { type: Number } }, // Legacy field for backward compatibility
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    status: {
      type: String,
      enum: ["OPEN", "ACCEPTED", "PICKED_UP", "COMPLETED", "DECLINED", "EXPIRED"],
      default: "OPEN"
    },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedCollector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acceptedAt: { type: Date },
    completedAt: { type: Date },
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    }
  },
  { timestamps: true }
);

donationSchema.index({ location: "2dsphere" });
donationSchema.index({ status: 1 });
donationSchema.index({ completedAt: 1 });
donationSchema.index({ completedBy: 1 });
donationSchema.index({ assignedCollector: 1, status: 1 });

export default mongoose.model("Donation", donationSchema);
