// =============================
// SERVER.JS – PRODUCTION READY
// =============================

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import http from "http";
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
   🌍 ENV-BASED CORS ORIGINS
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
       🔐 TRUST PROXY (Render/Vercel)
    =============================== */
    app.set("trust proxy", 1);

    /* ===============================
       🛡️ SECURITY MIDDLEWARE
    =============================== */
    app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    );

    /* ===============================
       🌐 CORS CONFIG
    =============================== */
    app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("CORS not allowed"));
          }
        },
        credentials: true,
      })
    );

    /* ===============================
       📦 BODY PARSER
    =============================== */
    app.use(express.json({ limit: "10mb" }));

    /* ===============================
       📊 LOGGER
    =============================== */
    app.use(morgan("dev"));

    /* ===============================
       🔌 SOCKET.IO
    =============================== */
    const io = new IOServer(server, {
      cors: {
        origin: allowedOrigins,
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
       🛣️ ROUTES
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
    app.use("/videos", videoRoutes);
    app.use("/api/feedbacks", feedbackRoutes);

    /* ===============================
       ❤️ HEALTH CHECK
    =============================== */
    app.get("/", (req, res) => {
      res.send("🚀 TechPaath API running");
    });

    app.get("/health", (req, res) => {
      res.json({ status: "OK", uptime: process.uptime() });
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
