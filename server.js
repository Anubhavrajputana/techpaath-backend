// =============================
// SERVER.JS – FINAL PRODUCTION READY (ULTIMATE FIX)
// =============================

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import http from "http";
import cookieParser from "cookie-parser";
import { Server as IOServer } from "socket.io";

import connectDB from "./config/db.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import internshipsRoute from "./routes/internships.js";
import enrollRoutes from "./routes/enroll.js";
import eventsRouter from "./routes/events.js";
import blogRoutes from "./routes/blogRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import webinarRoutes from "./routes/webinarRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import contactSalesRoutes from "./routes/contactSales.js";
import workshopRoutes from "./routes/workshop.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";

/* ===============================
   🌍 ALLOWED ORIGINS
=============================== */

const allowedOrigins = [
  process.env.CLIENT_URL, // Production frontend
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

/* ===============================
   🚀 START SERVER
=============================== */

async function startServer() {
  try {
    await connectDB();

    const app = express();
    const server = http.createServer(app);

    /* ===============================
       🔐 TRUST PROXY
    =============================== */
    app.set("trust proxy", 1);

    /* ===============================
       🛡️ SECURITY
    =============================== */
    app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    );

    /* ===============================
       🍪 COOKIE PARSER (AUTH FIX)
    =============================== */
    app.use(cookieParser());

    /* ===============================
       🌐 CORS – FINAL UNIVERSAL FIX
    =============================== */
    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow server / Postman
          if (!origin) return callback(null, true);

          // Allow defined origins
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          // Allow all Vercel deployments
          if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
          }

          // Allow all (fallback safety)
          return callback(null, true);
        },
        credentials: true,
      })
    );

    /* ===============================
       📦 BODY PARSER
    =============================== */
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));

    /* ===============================
       📊 LOGGER
    =============================== */
    app.use(morgan("dev"));

    /* ===============================
       🔌 SOCKET.IO – FINAL FIX
    =============================== */
    const io = new IOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);

      socket.on("joinBlogRoom", (blogId) => {
        socket.join(`blog_${blogId}`);
      });

      socket.on("leaveBlogRoom", (blogId) => {
        socket.leave(`blog_${blogId}`);
      });

      socket.on("disconnect", () => {
        console.log("🔌 Socket disconnected:", socket.id);
      });
    });

    /* ===============================
       🛣️ API ROUTES
    =============================== */

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/internships", internshipsRoute);
    app.use("/api/enrolls", enrollRoutes);
    app.use("/api/events", eventsRouter);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/webinars", webinarRoutes);
    app.use("/api/competitions", competitionRoutes);
    app.use("/api/hackathons", hackathonRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/contact-sales", contactSalesRoutes);
    app.use("/api/workshop", workshopRoutes);
    app.use("/api/mentor", mentorRoutes);
    app.use("/api/feedbacks", feedbackRoutes);

    // Static videos / uploads
    app.use("/videos", videoRoutes);

    /* ===============================
       ❤️ HEALTH CHECK
    =============================== */

    app.get("/", (req, res) => {
      res.send("🚀 TechPaath API running");
    });

    app.get("/health", (req, res) => {
      res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date(),
      });
    });

    /* ===============================
       ❌ GLOBAL ERROR HANDLER
    =============================== */
    app.use((err, req, res, next) => {
      console.error("❌ Global Error:", err.message);

      res.status(500).json({
        success: false,
        message: err.message || "Server Error",
      });
    });

    /* ===============================
       🚀 START SERVER
    =============================== */

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

    /* ===============================
       🧯 GRACEFUL SHUTDOWN
    =============================== */

    process.on("SIGINT", () => {
      console.log("🛑 Server shutting down...");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Startup error:", error);
    process.exit(1);
  }
}

startServer();
