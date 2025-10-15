import { Router } from "express";
import { getAdminStats, getAdminDonations, getAdminUsers, getAdminFeedback } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/donations", getAdminDonations);
router.get("/users", getAdminUsers);
router.get("/feedback", getAdminFeedback);

export default router;
