import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import {
  applyForInternship,
  getAppliedInternships,
} from "../controllers/internshipController.js";

const router = express.Router();

/* ===============================
   📁 Multer Setup
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ===============================
   🚀 Apply Internship
================================ */
router.post("/apply", auth, upload.single("resume"), applyForInternship);

/* ===============================
   ✅ Get Applied Internships
================================ */
router.get("/applied", auth, getAppliedInternships);

export default router;
