import Blog from "../models/Blog.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const replyComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text required" });
    }

    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      user: req.user._id,
      name: req.user.name || "User",
      avatar: req.user.avatar || "",
      text: text.trim(),
      reactions: [],
    });

    await blog.save();

    /* 🔔 SOCKET */
    req.app.get("io")?.to(`blog_${blog._id}`).emit("blogUpdated", blog);

    const replyingUserId = req.user._id.toString();
    const commentOwnerId = comment.user?.toString();
    const blogOwnerId = blog.user?.toString();

    /* ================= EMAIL: COMMENT OWNER ================= */
    if (commentOwnerId && commentOwnerId !== replyingUserId) {
      const owner = await User.findById(commentOwnerId).select("email name");
      if (owner?.email) {
        await sendEmail({
          to: owner.email,
          subject: "💬 New reply on your comment",
          html: `<p><b>${req.user.name}</b> replied: ${text}</p>`,
        });
      }
    }

    /* ================= EMAIL: BLOG OWNER ================= */
    if (
      blogOwnerId &&
      blogOwnerId !== replyingUserId &&
      blogOwnerId !== commentOwnerId
    ) {
      const blogOwner = await User.findById(blogOwnerId).select("email name");
      if (blogOwner?.email) {
        await sendEmail({
          to: blogOwner.email,
          subject: "📝 New activity on your blog",
          html: `<p><b>${req.user.name}</b> replied to a comment on your blog.</p>`,
        });
      }
    }

    return res.status(201).json(blog);
  } catch (err) {
    console.error("REPLY ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};
