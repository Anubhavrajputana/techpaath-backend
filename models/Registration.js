import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: String,
  email: String,
  registeredAt: { type: Date, default: Date.now }
});

export default mongoose.model('Registration', RegistrationSchema);
