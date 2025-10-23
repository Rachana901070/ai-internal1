import asyncHandler from "express-async-handler";
import Proof from "../models/Proof.js";
import Donation from "../models/Donation.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadProof = asyncHandler(async (req, res) => {
  const { donationId, location, lat, lng } = req.body;

  // Validate required fields
  if (!donationId || !location || !lat || !lng) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate photos (at least 1 required)
  if (!req.files || !req.files.photos || req.files.photos.length === 0) {
    return res.status(400).json({ message: "At least one photo is required" });
  }

  if (req.files.photos.length > 5) {
    return res.status(400).json({ message: "Maximum 5 photos allowed" });
  }

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, "../../uploads/proofs", donationId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Process photos - store file paths
  const photos = [];
  const timestamp = Date.now();

  for (let i = 0; i < req.files.photos.length; i++) {
    const file = req.files.photos[i];

    // Generate unique filename
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${timestamp}_${i}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Move file to permanent location
    await fs.promises.rename(file.path, filepath);

    photos.push(filepath);
  }

  // Process video (optional)
  let video = null;
  if (req.files && req.files.video && req.files.video.length > 0) {
    const videoFile = req.files.video[0];
    const videoFilename = `${timestamp}_video${path.extname(videoFile.originalname) || '.mp4'}`;
    const videoFilepath = path.join(uploadDir, videoFilename);

    await fs.promises.rename(videoFile.path, videoFilepath);
    video = videoFilepath;
  }

  // Create proof document
  const proof = await Proof.create({
    donation: donationId,
    collector: req.user._id,
    photos,
    video,
    location,
    coords: { lat: parseFloat(lat), lng: parseFloat(lng) }
  });

  // Update donation status
  const updatedDonation = await Donation.findByIdAndUpdate(donationId, {
    status: 'COMPLETED',
    completedAt: new Date(),
    completedBy: req.user._id
  }, { new: true });

  res.status(201).json({
    success: true,
    message: 'Proof uploaded successfully.',
    updated: { status: 'COMPLETED' }
  });
});

export const getProofsByDonation = asyncHandler(async (req, res) => {
  const proofs = await Proof.find({ donation: req.params.donationId })
    .populate('collector', 'name')
    .sort({ createdAt: -1 });
  res.json(proofs);
});
