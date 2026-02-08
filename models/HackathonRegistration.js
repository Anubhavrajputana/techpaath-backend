import mongoose from "mongoose";

const hackathonRegistrationSchema = new mongoose.Schema(
  {
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    name: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

hackathonRegistrationSchema.index(
  { hackathonId: 1, email: 1 },
  { unique: true }
);

export default mongoose.models.HackathonRegistration ||
  mongoose.model("HackathonRegistration", hackathonRegistrationSchema);
