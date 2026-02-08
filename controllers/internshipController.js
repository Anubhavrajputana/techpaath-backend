import InternshipApplication from "../models/InternshipApplication.js";

/* ===============================
   🚀 APPLY INTERNSHIP (UNCHANGED LOGIC)
================================ */
export const applyForInternship = async (req, res) => {
  try {
    const user = req.user;
    const { internshipName, skills, phone } = req.body;

    if (!internshipName) {
      return res.status(400).json({
        success: false,
        message: "Internship name is required",
      });
    }

    if (!user.phone && phone) {
      user.phone = phone;
      await user.save();
    }

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Please update your phone number before applying",
      });
    }

    const alreadyApplied = await InternshipApplication.findOne({
      email: user.email,
      internshipName,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this internship",
      });
    }

    await InternshipApplication.create({
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      internshipName,
      skills,
      resumeLink: req.file?.path || null,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (err) {
    console.error("Internship Apply Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===============================
   ✅ GET APPLIED INTERNSHIPS
================================ */
export const getAppliedInternships = async (req, res) => {
  try {
    const user = req.user;

    const applications = await InternshipApplication.find(
      { email: user.email },
      { internshipName: 1, _id: 0 }
    );

    const applied = applications.map(a => a.internshipName);

    res.json({
      success: true,
      applied,
    });
  } catch (err) {
    console.error("Fetch Applied Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
