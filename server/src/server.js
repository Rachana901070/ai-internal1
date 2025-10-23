import "dotenv/config";
import http from "http";
import { connectDB, disconnectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maitri_dhatri";

const server = http.createServer(app);

(async () => {
  try {
    await connectDB(MONGO_URI);
    server.listen(PORT, () => console.log(`✅ API server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server due to MongoDB connection error:", error.message);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Received SIGINT, shutting down gracefully...");
  try {
    await disconnectDB();
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error during shutdown:", error.message);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...");
  try {
    await disconnectDB();
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error during shutdown:", error.message);
    process.exit(1);
  }
});
