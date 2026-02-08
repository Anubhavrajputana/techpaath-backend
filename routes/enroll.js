import express from "express";
import upload from "../middleware/upload.js";
import { enrollCourse } from "../controllers/courseController.js";
import auth from "../middleware/auth.js";
import Enroll from "../models/Enroll.js";

const router = express.Router();

/* ===============================
   🔐 GET MY ENROLLED COURSES
   (Used for notes lock/unlock)
================================ */
router.get("/my", auth, async (req, res) => {
  try {
    const enrolls = await Enroll.find({
      user: req.user._id,
      status: { $in: ["Pending", "Approved"] }, // 🔥 IMPORTANT
    }).select("course status createdAt");

    res.status(200).json(enrolls);
  } catch (err) {
    console.error("Fetch enrollments error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
});

/* ===============================
   🚀 POST ENROLL COURSE
================================ */
router.post(
  "/",
  auth,
  upload.single("paymentScreenshot"),
  enrollCourse
);

export default router;
