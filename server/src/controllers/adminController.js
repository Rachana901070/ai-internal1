import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Donation from "../models/Donation.js";
import Match from "../models/Match.js";
import Proof from "../models/Proof.js";

export const getAdminStats = asyncHandler(async (req, res) => {
  const [users, donations, matches, proofs] = await Promise.all([
    User.countDocuments(),
    Donation.countDocuments(),
    Match.countDocuments(),
    Proof.countDocuments()
  ]);

  res.json({
    totalUsers: users,
    totalDonations: donations,
    totalMatches: matches,
    totalProofs: proofs
  });
});

export const getAdminDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate("donor", "name email role").sort({ createdAt: -1 });
  res.json(donations);
});

export const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json(users);
});

export const getAdminFeedback = asyncHandler(async (req, res) => {
  res.json([
    { id: 1, message: "The pickup reminders are super helpful!", rating: 5 },
    { id: 2, message: "Would love bulk upload for recurring donations.", rating: 4 }
  ]);
});
