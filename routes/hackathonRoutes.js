import express from "express";
import {
  registerHackathon,
  getHackathonRegistrations,
  createHackathon,
} from "../controllers/hackathonController.js";

const router = express.Router();

/* USER */
router.post("/register", registerHackathon);

/* ADMIN */
router.post("/", createHackathon);
router.get("/:id/registrations", getHackathonRegistrations);

export default router;
