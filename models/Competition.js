import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  mode: String,
  prizes: [String],
  image: String,
});

export default mongoose.model("Competition", competitionSchema);
