import express from "express";
import Competition from "../models/Competition.js";
import Hackathon from "../models/Hackathon.js";
import Webinar from "../models/Webinar.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const competitions = await Competition.find();
    const hackathons = await Hackathon.find();
    const webinars = await Webinar.find();

    const formattedCompetitions = competitions.map(c => ({
      _id: c._id,
      title: c.title,
      description: c.description,
      date: c.date,
      mode: c.mode,
      type: "competition",
    }));

    const formattedHackathons = hackathons.map(h => ({
      _id: h._id,
      title: h.title,
      description: h.description,
      date: h.date,
      mode: h.mode,
      type: "hackathon",
    }));

    const formattedWebinars = webinars.map(w => ({
      _id: w._id,                 // ✅ ONLY THIS
      title: w.title,
      description: w.description,
      date: w.date,
      mode: w.mode,
      meetLink: w.meetLink,
      organizer: "TechPaath Solutions",
      type: "webinar",
    }));

    const allEvents = [
      ...formattedCompetitions,
      ...formattedHackathons,
      ...formattedWebinars,
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(allEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
