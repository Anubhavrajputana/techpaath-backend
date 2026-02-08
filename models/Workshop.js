import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  college: String,
  meetingLink: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Workshop", WorkshopSchema);
