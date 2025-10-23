import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import nodeGeocoder from "node-geocoder";
import User from "../models/User.js";
import { generateToken, setTokenCookie } from "../utils/token.js";

const geocoder = nodeGeocoder({
  provider: process.env.GEOCODER_PROVIDER || 'opencage',
  apiKey: process.env.OPENCAGE_API_KEY || process.env.GOOGLE_MAPS_API_KEY,
  formatter: null
});

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  rating: user.rating,
  address: user.address,
  location: user.location
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = generateToken(user._id);
  setTokenCookie(res, token);
  res.status(201).json({ success: true, message: "Registration successful", token, user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);
  res.json({ success: true, token, user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json(sanitizeUser(req.user));
});

export const saveLocation = asyncHandler(async (req, res) => {
  const { address, lat, lng } = req.body;

  console.log(`Location save attempt - User: ${req.user._id}, Body:`, req.body);

  // Validate and parse coordinates
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    console.error("Invalid coordinates:", { lat, lng });
    res.status(400);
    throw new Error("invalidCoordinates");
  }

  if (req.user.role !== "collector") {
    console.error("Non-collector trying to save location:", req.user.role);
    res.status(403);
    throw new Error("Only collectors can save location");
  }

  let formattedAddress = address;

  // If no address provided, reverse geocode
  if (!formattedAddress) {
    try {
      const geoResult = await geocoder.reverse({ lat: parsedLat, lon: parsedLng });
      if (geoResult && geoResult.length > 0) {
        formattedAddress = geoResult[0].formattedAddress;
      }
    } catch (error) {
      console.warn("Reverse geocoding failed:", error.message);
      formattedAddress = "<pending>";
    }
  }

  req.user.address = formattedAddress;
  req.user.location = {
    type: "Point",
    coordinates: [parsedLng, parsedLat] // [lng, lat]
  };

  await req.user.save();

  console.log(`Location saved for user ${req.user._id}:`, req.user.location);

  res.status(201).json({
    address: req.user.address,
    location: req.user.location
  });
});
