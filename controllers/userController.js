import User from "../models/User.js";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("UPDATE PROFILE BODY:", req.body);
    console.log("USER ID:", req.user.id);

    const { name, course, year, phone } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (course !== undefined) updateData.course = course;
    if (year !== undefined) updateData.year = year;
    if (phone !== undefined) updateData.phone = phone;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,                 // 🔥 FIX HERE
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    console.log("UPDATED USER:", updatedUser);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};


/* ================= UPDATE AVATAR ================= */
export const updateAvatar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body.avatar) {
      return res.status(400).json({ message: "Avatar is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
  req.user.id,                 // 🔥 SAME FIX
  { $set: { avatar: req.body.avatar } },
  { new: true }
).select("-password");


    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update avatar error:", err);
    res.status(500).json({ message: "Avatar update failed" });
  }
};
