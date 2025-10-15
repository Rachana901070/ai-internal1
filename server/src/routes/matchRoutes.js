import { Router } from "express";
import { createMatch, completeMatch } from "../controllers/matchController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, authorize("admin"), createMatch);
router.patch("/:id/complete", protect, completeMatch);

export default router;
