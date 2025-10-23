import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    const health = {
      status: dbState === 1 ? "healthy" : "unhealthy",
      database: {
        state: dbStatus[dbState],
        name: mongoose.connection.name,
        host: mongoose.connection.host
      },
      timestamp: new Date().toISOString()
    };

    if (dbState === 1) {
      res.status(200).json(health);
    } else {
      res.status(503).json(health);
    }
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
