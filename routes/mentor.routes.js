import express from "express";
import Mentor from "../models/Mentor.js";
const router = express.Router();

router.post("/apply", async (req, res) => {
  const data = await Mentor.create(req.body);
  res.json({ success: true, data });
});

export default router;
