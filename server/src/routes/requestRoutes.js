import { Router } from "express";
import { createRequest, listMyRequests, updateRequest } from "../controllers/requestController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createRequest);
router.get("/mine", protect, listMyRequests);
router.patch("/:id", protect, updateRequest);

export default router;
