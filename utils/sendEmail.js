// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    // ✅ ENV CHECK (VERY IMPORTANT)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ EMAIL ENV VARIABLES MISSING");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // ✅ APP PASSWORD ONLY
      },
    });

    // ✅ VERIFY SMTP CONNECTION
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");

    // ✅ SEND EMAIL
    const info = await transporter.sendMail({
      from: `"TechPaath Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 EMAIL SENT:", info.messageId);
  } catch (error) {
    // ❌ THIS WAS MISSING — NOW YOU WILL SEE REAL ERROR
    console.error("❌ EMAIL SEND FAILED");
    console.error(error);
  }
};

export default sendEmail;
