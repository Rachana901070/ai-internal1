import { Router } from "express";
import multer from "multer";
import { uploadProof, getProofsByDonation } from "../controllers/proofController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Temporary directory - files will be moved by controller
    cb(null, '/tmp');
  },
  filename: (req, file, cb) => {
    // Temporary filename
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 6 // 5 photos + 1 video
  }
});

router.post("/upload", protect, upload.fields([
  { name: 'photos', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]), uploadProof);
router.get("/:donationId", protect, getProofsByDonation);

export default router;
