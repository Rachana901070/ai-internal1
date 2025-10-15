import { Router } from "express";
import {
  listDonations,
  listMyDonations,
  createDonation,
  updateDonation,
  deleteDonation
} from "../controllers/donationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listDonations);
router.get("/mine", protect, listMyDonations);
router.post("/", protect, createDonation);
router.patch("/:id", protect, updateDonation);
router.delete("/:id", protect, deleteDonation);

export default router;
