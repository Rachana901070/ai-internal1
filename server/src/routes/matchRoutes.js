import { Router } from "express";
import { createMatch, completeMatch, acceptPickup, getActivePickups, declinePickup } from "../controllers/matchController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/active", protect, getActivePickups);
router.post("/", protect, authorize("admin"), createMatch);
router.patch("/:id/complete", protect, completeMatch);
router.post("/accept/:donationId", protect, acceptPickup);
router.post("/decline/:donationId", protect, declinePickup);

// Collector-specific routes
router.post("/collector/accept/:donationId", protect, acceptPickup);
router.post("/collector/decline/:donationId", protect, declinePickup);

export default router;
