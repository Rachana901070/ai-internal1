import asyncHandler from "express-async-handler";
import Request from "../models/Request.js";
import Donation from "../models/Donation.js";

export const createRequest = asyncHandler(async (req, res) => {
  const { donation: donationId, note } = req.body;
  if (!donationId) {
    res.status(400);
    throw new Error("Donation is required");
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  const request = await Request.create({ donation: donationId, collector: req.user._id, note });
  res.status(201).json(request);
});

export const listMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ collector: req.user._id })
    .populate("donation")
    .sort({ createdAt: -1 });
  res.json(requests);
});

export const updateRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id).populate("donation");
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (!request.donation.donor.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden");
  }

  request.status = req.body.status || request.status;
  await request.save();
  res.json(request);
});
