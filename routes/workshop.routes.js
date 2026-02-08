import express from "express";
import Workshop from "../models/Workshop.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  const data = await Workshop.create(req.body);
  res.json({ success: true, data });
});

export default router;
