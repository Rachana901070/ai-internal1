import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import collectorRoutes from "./routes/collectorRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import proofRoutes from "./routes/proofRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

import healthRoutes from "./routes/healthRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors({ origin:["http://localhost:5173","http://127.0.0.1:5173","http://localhost:5175","http://127.0.0.1:5175","http://localhost:5178","http://127.0.0.1:5178","http://localhost:5179","http://127.0.0.1:5179","http://localhost:5180","http://127.0.0.1:5180","http://localhost:5181","http://127.0.0.1:5181","http://localhost:5182","http://127.0.0.1:5182","http://localhost:5183","http://127.0.0.1:5183","http://localhost:5184","http://127.0.0.1:5184","http://localhost:5185","http://127.0.0.1:5185","http://localhost:5186","http://127.0.0.1:5186","http://localhost:5187","http://127.0.0.1:5187","http://localhost:5188","http://127.0.0.1:5188","http://localhost:5189","http://127.0.0.1:5189","http://localhost:5190","http://127.0.0.1:5190"], credentials:true }));
app.use(express.json({limit:"2mb"}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/collectors", collectorRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/proofs", proofRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/pickup", matchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/support", supportRoutes);

app.use("/api/health", healthRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SPA fallback: serve index.html for client-side routing
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });
} else {
  app.use((req,res)=>res.status(404).json({success:false,message:"Not found"}));
}
app.use(errorHandler);

export default app;
