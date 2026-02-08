import Enroll from "../models/Enroll.js";

export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { course, phone } = req.body;

    /* ===============================
       BASIC VALIDATION
    ================================ */
    if (!course) {
      return res.status(400).json({
        message: "Course is required",
      });
    }

    // ✅ Allow only valid course IDs
    const allowedCourses = ["c", "cpp", "python", "java", "fullstack", "uiux", "graphic"];
    if (!allowedCourses.includes(course)) {
      return res.status(400).json({
        message: "Invalid course selected",
      });
    }

    /* ===============================
       DUPLICATE CHECK
    ================================ */
    const alreadyEnrolled = await Enroll.findOne({
      user: userId,
      course,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already enrolled in this course",
      });
    }

    /* ===============================
       CREATE ENROLLMENT
    ================================ */
    const enroll = await Enroll.create({
      user: userId,
      fullName: req.user.name,
      email: req.user.email,
      phone: phone || "",
      course, // 🔥 SHORT ID ONLY
      paymentScreenshot: req.file ? req.file.path : "",
      status: "Pending",
    });

    /* ===============================
       SUCCESS RESPONSE
    ================================ */
    res.status(201).json({
      success: true,
      message: "Enrollment successful",
      enroll,
    });

  } catch (err) {
    console.error("EnrollCourse Error:", err);
    res.status(500).json({
      success: false,
      message: "Enrollment failed",
    });
  }
};
