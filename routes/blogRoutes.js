import express from "express";
import auth from "../middleware/auth.js";
import {
  reactToBlog,
  addComment,
  reactToComment,
  replyToComment,
  reactToReply,
  getBlogById,
  getAllBlogs,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:blogId", getBlogById);

router.post("/:blogId/react", auth, reactToBlog);
router.post("/:blogId/comment", auth, addComment);

router.post("/:blogId/comment/react", auth, reactToComment);
router.post("/:blogId/comment/:commentId/reply", auth, replyToComment);
router.post(
  "/:blogId/comment/:commentId/reply/:replyId/react",
  auth,
  reactToReply
);

export default router;
