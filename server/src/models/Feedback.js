import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 400 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Unique compound index to prevent duplicates
feedbackSchema.index({ donation: 1, reviewer: 1 }, { unique: true });

// Index for efficient queries
feedbackSchema.index({ collector: 1, createdAt: -1 });

export default mongoose.model("Feedback", feedbackSchema);
