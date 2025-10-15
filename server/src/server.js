import "dotenv/config";
import http from "http";
import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maitri_dhatri";

(async () => {
  try {
    await connectDB(MONGO_URI);
    console.log("✅ Mongo connected");
    http.createServer(app).listen(PORT, () => console.log(`✅ API on :${PORT}`));
  } catch (error) {
    console.error("Mongo connection failed", error);
    process.exit(1);
  }
})();
