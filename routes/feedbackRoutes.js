import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

/* 📩 POST FEEDBACK */
router.post("/", submitFeedback);

export default router;
