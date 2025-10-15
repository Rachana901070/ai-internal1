import { Router } from "express";
import { createProof, getProofsByDonation } from "../controllers/proofController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createProof);
router.get("/:donationId", protect, getProofsByDonation);

export default router;
