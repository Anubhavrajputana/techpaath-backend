import express from "express";
import {
  createCompetition,
  registerCompetition,
  getCompetitionRegistrations,
} from "../controllers/competitionController.js";

const router = express.Router();

// ADMIN
router.post("/admin/competitions", createCompetition);
router.get("/admin/competitions/:id/users", getCompetitionRegistrations);

// USER
router.post("/register", registerCompetition);

export default router;
