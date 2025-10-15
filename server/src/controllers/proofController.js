import asyncHandler from "express-async-handler";
import Proof from "../models/Proof.js";

export const createProof = asyncHandler(async (req, res) => {
  const payload = { ...req.body, collector: req.user._id };
  const proof = await Proof.create(payload);
  res.status(201).json(proof);
});

export const getProofsByDonation = asyncHandler(async (req, res) => {
  const proofs = await Proof.find({ donation: req.params.donationId }).sort({ createdAt: -1 });
  res.json(proofs);
});
