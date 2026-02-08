// models/Event.js
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: String,
  organizer: String,
  date: Date,
  type: String,
  description: String,
  prizes: [String],
  seats: Number,
  mode: String,
  image: String,
  link: String
});

export default mongoose.model('Event', EventSchema);
