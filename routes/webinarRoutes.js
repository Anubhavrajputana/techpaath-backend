import express from "express";
import {
  registerWebinar,
  getRegistrations,
  addMeetLink,
  createWebinar,
} from "../controllers/webinarController.js";

const router = express.Router();

/* ===============================
   USER ROUTE
   POST /api/webinars/register
================================ */
router.post("/register", registerWebinar);

/* ===============================
   ADMIN ROUTES
================================ */
router.post("/", createWebinar);                     // POST /api/webinars
router.get("/:id/registrations", getRegistrations);  // GET  /api/webinars/:id/registrations
router.put("/:id/link", addMeetLink);                // PUT  /api/webinars/:id/link

export default router;
