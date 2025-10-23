import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createFeedback, updateFeedback, getCollectorRatings, deleteFeedback } from "../controllers/feedbackController.js";

const router = Router();

router.post("/", protect, createFeedback);
router.put("/:id", protect, updateFeedback);
router.get("/collectors/:collectorId/ratings", getCollectorRatings);
router.delete("/:id", protect, deleteFeedback);

export default router;
