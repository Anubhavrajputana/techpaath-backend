import mongoose from "mongoose";

const webinarRegistrationSchema = new mongoose.Schema(
  {
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
      index: true, // ✅ faster lookup
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt auto
  }
);

/* ✅ Prevent duplicate registration
   Same email cannot register twice for same webinar */
webinarRegistrationSchema.index(
  { webinarId: 1, email: 1 },
  { unique: true }
);

// ✅ Safe export (prevents OverwriteModelError in dev)
const WebinarRegistration =
  mongoose.models.WebinarRegistration ||
  mongoose.model("WebinarRegistration", webinarRegistrationSchema);

export default WebinarRegistration;
