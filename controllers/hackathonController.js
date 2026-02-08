import Hackathon from "../models/Hackathon.js";
import HackathonRegistration from "../models/HackathonRegistration.js";

/* ===============================
   USER – REGISTER HACKATHON
   POST /api/hackathons/register
================================ */
export const registerHackathon = async (req, res) => {
  try {
    const { name, email, phone, hackathonId } = req.body;

    if (!name || !email || !phone || !hackathonId) {
      return res.status(400).json({ message: "All fields required" });
    }

    await HackathonRegistration.create({
      name,
      email,
      phone,
      hackathonId,
    });

    res.json({
      success: true,
      message: "Hackathon registered successfully",
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ===============================
   ADMIN – CREATE HACKATHON ✅
   POST /api/hackathons
================================ */
export const createHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json(hackathon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create hackathon" });
  }
};

/* ===============================
   ADMIN – VIEW REGISTRATIONS
   GET /api/hackathons/:id/registrations
================================ */
export const getHackathonRegistrations = async (req, res) => {
  try {
    const users = await HackathonRegistration.find({
      hackathonId: req.params.id,
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};
