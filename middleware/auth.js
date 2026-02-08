// ===============================
// AUTH MIDDLEWARE – FINAL FIXED
// ===============================

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    /* ===============================
       🔐 TOKEN EXTRACT (HEADER + COOKIE)
    =============================== */

    let token = null;

    // 1️⃣ Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Check cookies (fallback)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // ❌ No token found
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided" });
    }

    /* ===============================
       🔓 VERIFY TOKEN
    =============================== */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* ===============================
       👤 FETCH USER
    =============================== */

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found" });
    }

    /* ===============================
       📌 ATTACH USER TO REQUEST
    =============================== */

    req.user = user;
    next();
  } catch (err) {
    console.error(
      "AUTH ERROR:",
      err.message
    );

    return res
      .status(401)
      .json({ message: "Invalid or expired token" });
  }
};

export default requireAuth;
