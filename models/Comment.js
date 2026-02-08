import mongoose from "mongoose";

/* =======================
   REACTION SCHEMA
======================= */
const reactionSchema = new mongoose.Schema(
  {
    emoji: String,
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { _id: false }
);

/* =======================
   REPLY SCHEMA
======================= */
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    avatar: String,
    text: { type: String, required: true },
    reactions: { type: [reactionSchema], default: [] },
  },
  { timestamps: true }
);

/* =======================
   COMMENT SCHEMA
======================= */
const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    avatar: String,
    text: { type: String, required: true },
    reactions: { type: [reactionSchema], default: [] },
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
