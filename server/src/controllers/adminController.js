import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Donation from "../models/Donation.js";
import Match from "../models/Match.js";
import Proof from "../models/Proof.js";

const bucketToObject = (buckets) =>
  buckets.reduce((acc, bucket) => {
    const key = bucket._id || "Unspecified";
    acc[key] = bucket.count;
    return acc;
  }, {});

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

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [statusBuckets, priorityBuckets, typeBuckets] = await Promise.all([
    Donation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Donation.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Donation.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])
  ]);

  res.json({
    statusDistribution: bucketToObject(statusBuckets),
    priorityBreakdown: bucketToObject(priorityBuckets),
    topTypes: typeBuckets.map(item => ({
      type: item._id || "Unspecified",
      count: item.count
    }))
  });
});

export const getAdminFeedback = asyncHandler(async (req, res) => {
  res.json([
    { id: 1, message: "The pickup reminders are super helpful!", rating: 5 },
    { id: 2, message: "Would love bulk upload for recurring donations.", rating: 4 }
  ]);
});
