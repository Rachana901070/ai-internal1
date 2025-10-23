import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import Donation from "../models/Donation.js";

const recomputeCollectorRating = async (collectorId, session) => {
  const agg = await Feedback.aggregate([
    { $match: { collector: new mongoose.Types.ObjectId(collectorId) } },
    { $group: { _id: '$collector', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ], { session });

  const avg = agg[0]?.avg || 0;
  const count = agg[0]?.count || 0;
  const roundedAvg = Math.round(avg * 10) / 10; // 1 decimal place

  await User.findByIdAndUpdate(collectorId, { ratingAvg: roundedAvg, ratingCount: count }, { session });
  return { ratingAvg: roundedAvg, ratingCount: count };
};

export const createFeedback = asyncHandler(async (req, res) => {
  const { donationId, collectorId, rating, comment } = req.body;
  const reviewerId = req.user._id;

  // Guards
  const donation = await Donation.findById(donationId);
  if (!donation || donation.status !== 'COMPLETED' || !donation.donor.equals(reviewerId)) {
    res.status(403);
    throw new Error("Invalid donation or not authorized");
  }

  if (donation.assignedCollector.toString() !== collectorId) {
    res.status(400);
    throw new Error("Collector mismatch");
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check for existing feedback
    const existing = await Feedback.findOne({ donation: donationId, reviewer: reviewerId }, null, { session });
    if (existing) {
      await session.abortTransaction();
      res.status(409);
      throw new Error("Feedback already exists for this donation");
    }

    const feedback = await Feedback.create([{ donation: donationId, collector: collectorId, reviewer: reviewerId, rating, comment: comment?.trim() }], { session });

    const summary = await recomputeCollectorRating(collectorId, session);

    await session.commitTransaction();

    res.status(201).json({ feedback: feedback[0], summary });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const updateFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const reviewerId = req.user._id;

  const feedback = await Feedback.findById(id);
  if (!feedback || !feedback.reviewer.equals(reviewerId)) {
    res.status(403);
    throw new Error("Not authorized to edit this feedback");
  }

  const timeDiff = Date.now() - feedback.createdAt.getTime();
  if (timeDiff > 24 * 60 * 60 * 1000) {
    res.status(403);
    throw new Error("Edit window expired");
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    feedback.rating = rating ?? feedback.rating;
    feedback.comment = comment?.trim() ?? feedback.comment;
    feedback.updatedAt = new Date();
    await feedback.save({ session });

    const summary = await recomputeCollectorRating(feedback.collector, session);

    await session.commitTransaction();

    res.json({ feedback, summary });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getCollectorRatings = asyncHandler(async (req, res) => {
  const { collectorId } = req.params;
  const { limit = 10, skip = 0, sort = 'recent' } = req.query;

  const collector = await User.findById(collectorId).select('name ratingAvg ratingCount');
  if (!collector) {
    res.status(404);
    throw new Error("Collector not found");
  }

  // Badge logic
  let badge = null;
  if (collector.ratingAvg >= 4.8 && collector.ratingCount >= 50) badge = "Trusted";
  else if (collector.ratingAvg >= 4.5 && collector.ratingCount >= 20) badge = "Reliable";
  else if (collector.ratingCount >= 5) badge = "Rising";

  // Histogram
  const histogram = await Feedback.aggregate([
    { $match: { collector: new mongoose.Types.ObjectId(collectorId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);

  const hist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  histogram.forEach(h => { hist[h._id] = h.count; });

  // Reviews
  const sortOption = sort === 'top' ? { rating: -1, createdAt: -1 } : { createdAt: -1 };
  const reviews = await Feedback.find({ collector: collectorId })
    .populate('reviewer', 'name')
    .populate('donation', 'title')
    .sort(sortOption)
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .lean();

  res.json({
    collector: { _id: collector._id, name: collector.name, ratingAvg: collector.ratingAvg, ratingCount: collector.ratingCount, badge },
    histogram: hist,
    reviews: reviews.map(r => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      reviewer: { _id: r.reviewer._id, name: r.reviewer.name },
      donation: { _id: r.donation._id, title: r.donation.title }
    }))
  });
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error("Admin only");
  }

  const { id } = req.params;
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Feedback.findByIdAndDelete(id, { session });
    const summary = await recomputeCollectorRating(feedback.collector, session);
    await session.commitTransaction();

    res.json({ success: true, summary });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
