import mongoose from "mongoose";

const MentorSchema = new mongoose.Schema({
  name: String,
  email: String,
  expertise: String,
  experience: String,
  linkedin: String,
}, { timestamps: true });

export default mongoose.model("Mentor", MentorSchema);
