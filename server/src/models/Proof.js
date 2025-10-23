import mongoose from "mongoose";

const proofSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photos: [{ type: String, required: true }], // Array of file paths
    video: { type: String }, // File path
    location: { type: String, required: true },
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    deliveredAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

proofSchema.index({ 'location.point': '2dsphere' });

export default mongoose.model("Proof", proofSchema);
