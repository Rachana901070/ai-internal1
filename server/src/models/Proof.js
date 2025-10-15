import mongoose from "mongoose";

const proofSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photos: [{ type: String }],
    video: { type: String },
    location: {
      lat: Number,
      lng: Number
    },
    deliveredAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Proof", proofSchema);
