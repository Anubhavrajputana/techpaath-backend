import Feedback from "../models/Feedback.js";

/* ===============================
   📩 SUBMIT FEEDBACK
================================ */
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({
      message: "Server error while submitting feedback",
    });
  }
};
