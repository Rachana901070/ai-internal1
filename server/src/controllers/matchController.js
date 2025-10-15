import asyncHandler from "express-async-handler";
import Match from "../models/Match.js";
import Donation from "../models/Donation.js";

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

  match.status = "COMPLETED";
  await match.save();

  if (match.donation) {
    match.donation.status = "COMPLETED";
    await match.donation.save();
  }

  res.json(match);
});
