import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    internshipName: { type: String, required: true },

    skills: { type: String },
    resumeLink: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("InternshipApplication", applicationSchema);
