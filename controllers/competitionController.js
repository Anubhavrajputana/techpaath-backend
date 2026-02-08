import Competition from "../models/Competition.js";
import CompetitionRegistration from "../models/CompetitionRegistration.js";

/* ===============================
   ADMIN – CREATE COMPETITION
================================ */
export const createCompetition = async (req, res) => {
  try {
    const competition = await Competition.create(req.body);
    res.json(competition);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create competition",
    });
  }
};

/* ===============================
   USER – REGISTER COMPETITION
   ✅ DUPLICATE CHECK ADDED
================================ */
export const registerCompetition = async (req, res) => {
  try {
    const { competitionId, email } = req.body;

    // ✅ CHECK IF USER ALREADY REGISTERED
    const already = await CompetitionRegistration.findOne({
      competitionId,
      email,
    });

    if (already) {
      return res.status(400).json({
        message: "Already registered",
      });
    }

    // ✅ CREATE REGISTRATION
    await CompetitionRegistration.create(req.body);

    res.json({
      success: true,
      message: "Registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Competition registration failed",
    });
  }
};

/* ===============================
   ADMIN – VIEW REGISTERED USERS
================================ */
export const getCompetitionRegistrations = async (req, res) => {
  try {
    const users = await CompetitionRegistration.find({
      competitionId: req.params.id,
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch registrations",
    });
  }
};
