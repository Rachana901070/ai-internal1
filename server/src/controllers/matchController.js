import asyncHandler from "express-async-handler";
import Match from "../models/Match.js";
import Donation from "../models/Donation.js";
import User from "../models/User.js";

export const createMatch = asyncHandler(async (req, res) => {
  const { donation: donationId, collector, pickupTime } = req.body;
  if (!donationId || !collector || !pickupTime) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  const match = await Match.create({ donation: donationId, collector, pickupTime });
  donation.status = "MATCHED";
  await donation.save();

  res.status(201).json(match);
});

export const completeMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id).populate("donation");
  if (!match) {
    res.status(404);
    throw new Error("Match not found");
  }

  // Check if the user is the assigned collector
  if (!match.collector.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the assigned collector can complete this match");
  }

  match.status = "COMPLETED";
  await match.save();

  if (match.donation) {
    match.donation.status = "COMPLETED";
    await match.donation.save();
  }

  res.json(match);
});

export const acceptPickup = asyncHandler(async (req, res) => {
  const donationId = req.params.id;
  const collectorId = req.user._id;

  // Check if donation exists and is open
  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }
  if (donation.status !== "OPEN") {
    res.status(400);
    throw new Error("Donation is not available");
  }

  // Check if collector exists and is a collector
  const collector = await User.findById(collectorId);
  if (!collector || collector.role !== "collector") {
    res.status(403);
    throw new Error("Only collectors can accept pickups");
  }

  // Create or update match
  let match = await Match.findOne({ donation: donationId, collector: collectorId });
  if (!match) {
    const pickupTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    match = await Match.create({
      donation: donationId,
      collector: collectorId,
      pickupTime,
      status: "ASSIGNED"
    });
  } else {
    match.status = "ASSIGNED";
    await match.save();
  }

  // Update donation status
  donation.status = "ACCEPTED";
  donation.assignedCollector = collectorId;
  donation.acceptedAt = new Date();
  await donation.save();

  // Update match
  match.acceptedAt = new Date();
  await match.save();

  // Emit socket event if io is available
  if (res.io) {
    res.io.to(`user:${donation.donor}`).emit("pickup:accepted", {
      donationId,
      collectorId,
      pickupTime: match.pickupTime
    });
    res.io.to("collectors").emit("pickup:accepted", {
      donationId,
      collectorId,
      pickupTime: match.pickupTime
    });
  }

  const pickup = await Match.findById(match._id).populate("donation");
  res.status(201).json({ pickup, donation });
});

export const getActivePickups = asyncHandler(async (req, res) => {
  const collectorId = req.user._id;

  const matches = await Match.find({
    collector: collectorId,
    status: "ASSIGNED"
  })
    .populate({
      path: "donation",
      populate: {
        path: "donor",
        select: "name"
      }
    })
    .sort({ createdAt: -1 });

  const activePickups = matches.map(match => ({
    _id: match._id,
    donation: {
      _id: match.donation._id,
      title: match.donation.title,
      quantity: `${match.donation.quantity} ${match.donation.unit}`,
      location: match.donation.address,
      donor: { name: match.donation.donor?.name || "Unknown" },
      tags: [match.donation.type]
    },
    pickupTime: match.pickupTime,
    acceptedAt: match.acceptedAt,
    createdAt: match.createdAt
  }));

  res.json(activePickups);
});

export const declinePickup = asyncHandler(async (req, res) => {
  const { donationId } = req.params;
  const collectorId = req.user._id;

  // Check if donation exists
  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  // Keep as OPEN; just audit decline if needed
  // await Audit.create({ type:"DECLINE", donationId: d._id, by: req.user.id });

  // Emit socket event if io is available
  if (res.io) {
    res.io.emit("pickup:declined", { donationId, by: collectorId });
  }

  res.json({ ok: true });
});
