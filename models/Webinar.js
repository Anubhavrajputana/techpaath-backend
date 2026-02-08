// server/models/Webinar.js
import mongoose from "mongoose";

const webinarSchema = new mongoose.Schema(
  {
    // 🔑 MongoDB _id is PRIMARY KEY (auto)
    // slug OPTIONAL (sirf URL / SEO ke liye)
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // ✅ allow empty
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      default: "Online",
    },

    meetLink: {
      type: String,
      default: "",
    },

    // 🖼️ For card image
    image: {
      type: String,
      default: "/Contest_Image.png",
    },

    organizer: {
      type: String,
      default: "TechPaath Solutions",
    },

    seats: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Safe export (no overwrite error)
const Webinar =
  mongoose.models.Webinar ||
  mongoose.model("Webinar", webinarSchema);

export default Webinar;
