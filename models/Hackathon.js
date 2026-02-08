import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  duration: String,
  mode: String,
  prizes: [String],
  image: String,
});

export default mongoose.model("Hackathon", hackathonSchema);
