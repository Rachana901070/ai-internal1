import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import proofRoutes from "./routes/proofRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({limit:"2mb"}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/proofs", proofRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/admin", adminRoutes);

app.use((req,res)=>res.status(404).json({success:false,message:"Not found"}));
app.use(errorHandler);

export default app;
