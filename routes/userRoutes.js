import express from "express";
import auth from "../middleware/auth.js"; // ✅ FIXED
import {
  getProfile,
  updateProfile,
  updateAvatar,
} from "../controllers/userController.js";

const router = express.Router();

/* =====================================================
   👤 GET USER PROFILE
   GET /api/user/profile
===================================================== */
router.get("/profile", auth, getProfile);

/* =====================================================
   ✏️ UPDATE USER PROFILE
   PUT /api/user/profile
===================================================== */
router.put("/profile", auth, updateProfile);

/* =====================================================
   🖼️ UPDATE USER AVATAR
   PUT /api/user/profile/avatar
===================================================== */
router.put("/profile/avatar", auth, updateAvatar);

export default router;
