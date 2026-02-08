import Webinar from "../models/Webinar.js";
import WebinarRegistration from "../models/WebinarRegistration.js";

/* ===============================
   USER – REGISTER WEBINAR
================================ */
export const registerWebinar = async (req, res) => {
  try {
    const { name, email, phone, webinarId } = req.body;

    if (!name || !email || !phone || !webinarId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const already = await WebinarRegistration.findOne({
      webinarId,
      email,
    });

    if (already) {
      return res.status(400).json({ message: "Already registered" });
    }

    await WebinarRegistration.create({
      name,
      email,
      phone,
      webinarId,
    });

    res.json({
      success: true,
      message: "Webinar registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ===============================
   ADMIN – CREATE WEBINAR
================================ */
export const createWebinar = async (req, res) => {
  const webinar = await Webinar.create(req.body);
  res.status(201).json(webinar);
};

/* ===============================
   ADMIN – VIEW REGISTRATIONS
================================ */
export const getRegistrations = async (req, res) => {
  const users = await WebinarRegistration.find({
    webinarId: req.params.id,
  });
  res.json(users);
};

/* ===============================
   ADMIN – ADD MEET LINK
================================ */
export const addMeetLink = async (req, res) => {
  const webinar = await Webinar.findByIdAndUpdate(
    req.params.id,
    { meetLink: req.body.meetLink },
    { new: true }
  );
  res.json(webinar);
};
