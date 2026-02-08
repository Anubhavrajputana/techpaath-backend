import express from "express";
import ContactSales from "../models/ContactSales.js";

const router = express.Router();

// POST: Contact Sales
router.post("/", async (req, res) => {
  try {
    const { name, email, organization, message } = req.body;

    if (!name || !email || !organization || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const data = await ContactSales.create({
      name,
      email,
      organization,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
