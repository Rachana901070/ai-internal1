import { Router } from "express";
import { getCollectorStats } from "../controllers/donationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Collector stats endpoint
router.get("/stats", protect, getCollectorStats);

export default router;
