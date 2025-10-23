import asyncHandler from "express-async-handler";
import Donation from "../models/Donation.js";
import User from "../models/User.js";
import Match from "../models/Match.js";

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
  const { geo, ...rest } = req.body;

  // Validate geo coordinates if provided
  if (geo && (typeof geo.lat !== 'number' || typeof geo.lng !== 'number')) {
    res.status(400);
    throw new Error("Invalid geo coordinates");
  }

  const payload = {
    ...rest,
    donor: req.user._id,
    address: rest.address
  };

  // Set GeoJSON location and legacy geo if coordinates provided
  if (geo) {
    payload.location = {
      type: 'Point',
      coordinates: [geo.lng, geo.lat] // [lng, lat]
    };
    payload.geo = geo;
  }

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

  const updatePayload = {
    ...req.body,
    address: req.body.address
  };

  // Set GeoJSON location and legacy geo if coordinates provided
  if (req.body.geo) {
    updatePayload.location = {
      type: 'Point',
      coordinates: [req.body.geo.lng, req.body.geo.lat] // [lng, lat]
    };
    updatePayload.geo = req.body.geo;
  }

  Object.assign(donation, updatePayload);
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



export const getAvailableDonations = asyncHandler(async (req, res) => {
  const { urgency } = req.query;
  let filter = { status: "OPEN", expiresAt: { $gte: new Date() } };

  if (urgency && urgency !== "all") {
    filter.priority = urgency;
  }

  const donations = await Donation.find(filter)
    .populate("donor", "name email")
    .sort({ createdAt: -1 });

  const filteredDonations = donations.map(donation => {
    const now = new Date();
    const expiresAt = new Date(donation.expiresAt);
    const timeDiff = expiresAt - now;
    const hoursLeft = Math.max(0, timeDiff / (1000 * 60 * 60));
    const timeLeft = hoursLeft < 1 ? `${Math.floor(hoursLeft * 60)} minutes` : `${hoursLeft.toFixed(1)} hours`;

    return {
      _id: donation._id,
      title: donation.title,
      quantity: `${donation.quantity} ${donation.unit}`,
      timeLeft,
      priority: donation.priority,
      donor: { name: donation.donor.name },
      location: donation.address,
      tags: [donation.type],
      status: donation.status,
      createdAt: donation.createdAt,
      expiresAt: donation.expiresAt
    };
  });

  res.json(filteredDonations);
});

export const getCollectorStats = asyncHandler(async (req, res) => {
  const collectorId = req.user._id;

  // Calculate today's date range in server local timezone
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // Use aggregation for accurate counts
  const stats = await Donation.aggregate([
    {
      $match: {
        assignedCollector: collectorId,
        status: 'COMPLETED'
      }
    },
    {
      $group: {
        _id: null,
        totalCollections: { $sum: 1 },
        todaysPickups: {
          $sum: {
            $cond: [
              { $and: [
                { $gte: ['$completedAt', startOfDay] },
                { $lt: ['$completedAt', endOfDay] }
              ] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  const totalCollections = stats[0]?.totalCollections || 0;
  const todaysPickups = stats[0]?.todaysPickups || 0;

  // Active pickups: ACCEPTED donations assigned to this collector
  const activePickups = await Donation.countDocuments({
    assignedCollector: collectorId,
    status: 'ACCEPTED'
  });

  // Rating placeholder (can be implemented later with reviews)
  const rating = 0;

  res.json({
    todaysPickups,
    totalCollections,
    rating,
    activePickups
  });
});

export const acceptDonation = asyncHandler(async (req, res) => {
  const donationId = req.params.id;
  const collectorId = req.user ? req.user._id : req.body.collectorId;

  if (!collectorId) {
    res.status(400);
    throw new Error("Collector ID required");
  }

  // Find and update donation atomically
  const donation = await Donation.findOneAndUpdate(
    { _id: donationId, status: "OPEN" },
    {
      status: "ACCEPTED",
      assignedCollector: collectorId,
      acceptedAt: new Date()
    },
    { new: true }
  ).populate("donor", "name");

  if (!donation) {
    res.status(404);
    throw new Error("Donation not found or not available");
  }

  console.log(`Donation ${donationId} accepted by collector ${collectorId}`);

  res.json(donation);
});

export const getActivePickupsForCollector = asyncHandler(async (req, res) => {
  const collectorId = req.user._id;

  // Get accepted donations directly assigned to this collector
  const donations = await Donation.find({
    assignedCollector: collectorId,
    status: "ACCEPTED"
  })
    .populate("donor", "name")
    .sort({ acceptedAt: -1 });

  const activePickups = donations.map(donation => ({
    _id: donation._id,
    donation: {
      _id: donation._id,
      title: donation.title,
      quantity: `${donation.quantity} ${donation.unit}`,
      location: donation.address,
      donor: { name: donation.donor?.name || "Unknown" },
      tags: [donation.type]
    },
    acceptedAt: donation.acceptedAt,
    createdAt: donation.createdAt
  }));

  res.json(activePickups);
});

export const declineDonation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const collectorId = req.user._id;

  const donation = await Donation.findById(id);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }

  donation.status = "DECLINED";
  donation.declinedBy = collectorId; // Optional: track who declined
  await donation.save();

  res.json({ success: true, message: "Donation declined successfully" });
});


