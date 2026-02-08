// server/routes/videoRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Video from "../models/Video.js";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ensure path is correct

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/** Helper: Upload buffer to Cloudinary (video) */
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "techpaath_videos" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

/** Middleware: verifyAdmin (token => user => role) */
async function verifyAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(payload.id).select("role");
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // attach user to request for later use
    req.user = user;
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err.message || err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/* ---------------------------------------------------
   GET ALL VIDEOS (Public)
--------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({ videos });
  } catch (err) {
    console.error("GET /videos error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ---------------------------------------------------
   ADMIN UPLOAD VIDEO (Admin only)
   Body: form-data { title, category, file }
--------------------------------------------------- */
router.post("/upload", verifyAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileBuffer = req.file.buffer;
    const result = await uploadToCloudinary(fileBuffer);

    const thumbnail = result.secure_url && result.secure_url.includes(".mp4")
      ? result.secure_url.replace(".mp4", ".jpg")
      : result.secure_url; // fallback

    const video = await Video.create({
      title: req.body.title || "Untitled Video",
      category: req.body.category || "General",
      videoUrl: result.secure_url,
      cloudinaryId: result.public_id,
      thumbnail,
      uploadedBy: req.user._id,
    });

    res.json({ success: true, video });
  } catch (err) {
    console.error("POST /videos/upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

/* ---------------------------------------------------
   DELETE VIDEO (Admin only)
--------------------------------------------------- */
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // delete from cloudinary
    if (video.cloudinaryId) {
      await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: "video" });
    }

    await video.deleteOne();

    res.json({ success: true, message: "Video deleted" });
  } catch (err) {
    console.error("DELETE /videos/:id error:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

export default router;
