import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String },

    // ================= AUTH PROVIDERS =================
    googleId: { type: String, default: null },

    // ================= PROFILE =================
    avatar: { type: String, default: null },
    role: { type: String, default: "user" },

    // 🔥 ADD THESE (THIS WAS THE REAL FIX)
    phone: { type: String, default: "" },
    course: { type: String, default: "" },
    year: { type: String, default: "" },
  },
  { timestamps: true }
);

/* ================= PASSWORD HASH ================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ================= PASSWORD COMPARE (OPTIONAL BUT GOOD) ================= */
userSchema.methods.comparePassword = function (pw) {
  if (!this.password) return false;
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model("User", userSchema);
