import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["donor", "collector", "admin"], default: "donor" },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    address: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
