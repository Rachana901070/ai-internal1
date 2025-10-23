import { Router } from "express";
import {
  listDonations,
  listMyDonations,
  createDonation,
  updateDonation,
  deleteDonation,
  getAvailableDonations,
  getCollectorStats,
  getActivePickupsForCollector,
  acceptDonation,
  declineDonation
} from "../controllers/donationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listDonations);
router.get("/available", getAvailableDonations); // Updated to use new function
router.get("/mine", protect, listMyDonations);
router.post("/", protect, createDonation);
router.patch("/:id", protect, updateDonation);
router.delete("/:id", protect, deleteDonation);
router.get("/collector/stats", protect, getCollectorStats);
router.get("/active/my", protect, getActivePickupsForCollector);
router.patch("/:id/accept", protect, acceptDonation);
router.patch("/:id/decline", protect, declineDonation);


// AI classification endpoint
router.post("/ai/classifyFood", protect, (req, res) => {
  // Mock AI classification - in real app, this would call an AI service
  const mockClassifications = [
    "Rice & Curry",
    "Bread & Sandwiches",
    "Sweets",
    "Fruits",
    "Others"
  ];
  const randomType = mockClassifications[Math.floor(Math.random() * mockClassifications.length)];
  res.json({ foodType: randomType, confidence: Math.random() * 0.5 + 0.5 });
});

export default router;
