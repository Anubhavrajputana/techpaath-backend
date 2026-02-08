import mongoose from "mongoose";

const competitionRegistrationSchema = new mongoose.Schema({
  competitionId: String,
  name: String,
  email: String,
  phone: String,
  registeredAt: { type: Date, default: Date.now },
});

export default mongoose.model(
  "CompetitionRegistration",
  competitionRegistrationSchema
);
