import { Router } from "express";
import { submitContact } from "../controllers/supportController.js";

const router = Router();

router.post("/contact", submitContact);

export default router;
