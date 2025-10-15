import asyncHandler from "express-async-handler";
import Donation from "../models/Donation.js";

export const listDonations = asyncHandler(async (req, res) => {
  const { status, priority, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (type) filter.type = type;

  const donations = await Donation.find(filter)
    .populate("donor", "name email")
    .sort({ createdAt: -1 });
  res.json(donations);
});

export const listMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
  res.json(donations);
});

export const createDonation = asyncHandler(async (req, res) => {
  const payload = { ...req.body, donor: req.user._id };
  const donation = await Donation.create(payload);
  res.status(201).json(donation);
});

export const updateDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }
  if (!donation.donor.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden");
  }
  Object.assign(donation, req.body);
  await donation.save();
  res.json(donation);
});

export const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }
  if (!donation.donor.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden");
  }
  await donation.deleteOne();
  res.json({ success: true });
});
