// server/models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },

    // Cloudinary hosted URL
    videoUrl: { type: String, required: true },

    // thumbnail (optional) — storing direct secure url
    thumbnail: { type: String },

    // cloudinary public id for deletion
    cloudinaryId: { type: String },

    // who uploaded (admin user id)
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
