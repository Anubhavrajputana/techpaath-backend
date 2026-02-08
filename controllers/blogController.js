import Blog from "../models/Blog.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

/* =======================
   🛡️ SAFE HELPERS
======================= */
const ensureArray = (arr) => (Array.isArray(arr) ? arr : []);

const cleanReactions = (reactions) =>
  Array.isArray(reactions)
    ? reactions.filter(
        (r) =>
          r &&
          typeof r.emoji === "string" &&
          r.emoji.trim() !== "" &&
          Array.isArray(r.users)
      )
    : [];

const normalizeBlog = (blog) => {
  blog.reactions = cleanReactions(blog.reactions);

  blog.comments = ensureArray(blog.comments);
  blog.comments.forEach((c) => {
    c.reactions = cleanReactions(c.reactions);
    c.replies = ensureArray(c.replies);

    c.replies.forEach((r) => {
      r.reactions = cleanReactions(r.reactions);
    });
  });

  return blog;
};

/* =======================
   🌐 LINKS HELPERS
======================= */
const ADMIN_EMAIL = "harshchauhan7000@gmail.com";

const getBlogLink = (blogId) =>
  `${process.env.CLIENT_URL}/blog/${blogId}`;

const getCommentLink = (blogId, commentId) =>
  `${process.env.CLIENT_URL}/blog/${blogId}#${commentId}`;

const getReplyLink = (blogId, replyId) =>
  `${process.env.CLIENT_URL}/blog/${blogId}#${replyId}`;

/* ======================================================
   ❤️ BLOG REACTION
====================================================== */
export const reactToBlog = async (req, res) => {
  try {
    const { emoji } = req.body;
    const { blogId } = req.params;
    const user = req.user;

    if (!emoji)
      return res.status(400).json({ message: "Emoji required" });

    const blog = await Blog.findById(blogId).populate(
      "user",
      "email name"
    );

    if (!blog)
      return res.status(404).json({ message: "Blog not found" });

    blog.reactions = ensureArray(blog.reactions);

    let reaction = blog.reactions.find((r) => r.emoji === emoji);

    if (!reaction) {
      blog.reactions.push({ emoji, users: [user._id] });
    } else {
      reaction.users = ensureArray(reaction.users);

      const idx = reaction.users.findIndex(
        (u) => u.toString() === user._id.toString()
      );

      idx > -1
        ? reaction.users.splice(idx, 1)
        : reaction.users.push(user._id);
    }

    await blog.save();
    normalizeBlog(blog);

    req.app
      .get("io")
      ?.to(`blog_${blog._id}`)
      .emit("blogUpdated", blog);

    /* ================= EMAILS ================= */

    const reactor = await User.findById(user._id);
    const blogLink = getBlogLink(blog._id);

    // 📧 Email to Blog Author
    if (blog.user?.email && blog.user.email !== reactor.email) {
      await sendEmail({
        to: blog.user.email,
        subject: "❤️ New Reaction on Your Blog",
        html: `
          <h3>Hello ${blog.user.name},</h3>
          <p>${reactor.name} reacted to your blog.</p>
          <p>Reaction: ${emoji}</p>

          <a href="${blogLink}"
             style="
               display:inline-block;
               padding:10px 18px;
               background:#4f46e5;
               color:#fff;
               text-decoration:none;
               border-radius:6px;
               margin-top:10px;
             ">
             🔎 View Reaction
          </a>
        `,
      });
    }

    // 📧 Admin → ONLY BLOG REACTIONS
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: "📊 Blog Reaction Notification",
      html: `
        <h3>New Reaction on Blog</h3>
        <p><b>User:</b> ${reactor.name}</p>
        <p><b>Email:</b> ${reactor.email}</p>
        <p><b>Reaction:</b> ${emoji}</p>
        <p><b>Blog ID:</b> ${blog._id}</p>

        <a href="${blogLink}"
           style="padding:10px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
           View Blog
        </a>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("BLOG REACTION ERROR:", err);
    res.status(500).json({ message: "Reaction failed" });
  }
};

/* ======================================================
   ❤️ COMMENT REACTION
====================================================== */
export const reactToComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { commentId, emoji } = req.body;
    const user = req.user;

    if (!emoji)
      return res.status(400).json({ message: "Emoji required" });

    const blog = await Blog.findById(blogId);

    blog.comments = ensureArray(blog.comments);

    const comment = blog.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    comment.reactions = ensureArray(comment.reactions);

    let reaction = comment.reactions.find((r) => r.emoji === emoji);

    if (!reaction) {
      comment.reactions.push({
        emoji,
        users: [user._id],
      });
    } else {
      reaction.users = ensureArray(reaction.users);

      const idx = reaction.users.findIndex(
        (u) => u.toString() === user._id.toString()
      );

      idx > -1
        ? reaction.users.splice(idx, 1)
        : reaction.users.push(user._id);
    }

    await blog.save();
    normalizeBlog(blog);

    req.app
      .get("io")
      ?.to(`blog_${blog._id}`)
      .emit("blogUpdated", blog);

    const reactor = await User.findById(user._id);
    const commentOwner = await User.findById(comment.user);
    const link = getCommentLink(blog._id, comment._id);

    if (commentOwner?.email && commentOwner.email !== reactor.email) {
      await sendEmail({
        to: commentOwner.email,
        subject: "💬 Reaction on Your Comment",
        html: `
          <p>${reactor.name} reacted to your comment.</p>
          <p>Reaction: ${emoji}</p>

          <a href="${link}"
             style="padding:10px 18px;background:#9333ea;color:#fff;text-decoration:none;border-radius:6px;">
             View Reaction
          </a>
        `,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("COMMENT REACTION ERROR:", err);
    res.status(500).json({ message: "Comment reaction failed" });
  }
};

/* ======================================================
   ❤️ REACT TO REPLY
====================================================== */
export const reactToReply = async (req, res) => {
  try {
    const { blogId, commentId, replyId } = req.params;
    const { emoji } = req.body;
    const user = req.user;

    if (!emoji)
      return res.status(400).json({ message: "Emoji required" });

    const blog = await Blog.findById(blogId);

    blog.comments = ensureArray(blog.comments);
    const comment = blog.comments.id(commentId);
    const reply = comment?.replies.id(replyId);

    if (!reply)
      return res.status(404).json({ message: "Reply not found" });

    reply.reactions = ensureArray(reply.reactions);

    let reaction = reply.reactions.find((r) => r.emoji === emoji);

    if (!reaction) {
      reply.reactions.push({
        emoji,
        users: [user._id],
      });
    } else {
      reaction.users = ensureArray(reaction.users);

      const idx = reaction.users.findIndex(
        (u) => u.toString() === user._id.toString()
      );

      idx > -1
        ? reaction.users.splice(idx, 1)
        : reaction.users.push(user._id);
    }

    await blog.save();
    normalizeBlog(blog);

    req.app
      .get("io")
      ?.to(`blog_${blog._id}`)
      .emit("blogUpdated", blog);

    const reactor = await User.findById(user._id);
    const replyOwner = await User.findById(reply.user);
    const link = getReplyLink(blog._id, reply._id);

    if (replyOwner?.email && replyOwner.email !== reactor.email) {
      await sendEmail({
        to: replyOwner.email,
        subject: "↩️ Reaction on Your Reply",
        html: `
          <p>${reactor.name} reacted: ${emoji}</p>

          <a href="${link}"
             style="padding:10px 18px;background:#0891b2;color:#fff;text-decoration:none;border-radius:6px;">
             View Reaction
          </a>
        `,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("REPLY REACTION ERROR:", err);
    res.status(500).json({ message: "Reply reaction failed" });
  }
};

/* ======================================================
   💬 ADD COMMENT
====================================================== */
export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text } = req.body;
    const user = req.user;

    if (!text?.trim())
      return res.status(400).json({ message: "Comment text required" });

    const blog = await Blog.findById(blogId).populate(
      "user",
      "email name"
    );

    blog.comments = ensureArray(blog.comments);

    blog.comments.unshift({
      text: text.trim(),
      user: user._id,
      name: user.name,
      avatar: user.avatar || "",
      reactions: [],
      replies: [],
    });

    await blog.save();
    normalizeBlog(blog);

    req.app
      .get("io")
      ?.to(`blog_${blog._id}`)
      .emit("blogUpdated", blog);

    const link = getBlogLink(blog._id);

    if (blog.user?.email !== user.email) {
      await sendEmail({
        to: blog.user.email,
        subject: "💬 New Comment on Your Blog",
        html: `
          <p>${user.name} commented:</p>
          <blockquote>${text}</blockquote>

          <a href="${link}"
             style="padding:10px 18px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px;">
             View Comment
          </a>
        `,
      });
    }

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* ======================================================
   ↩️ REPLY TO COMMENT
====================================================== */
export const replyToComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { text } = req.body;
    const user = req.user;

    const blog = await Blog.findById(blogId);
    const comment = blog.comments.id(commentId);

    comment.replies.push({
      text: text.trim(),
      user: user._id,
      name: user.name,
      avatar: user.avatar || "",
      reactions: [],
    });

    await blog.save();
    normalizeBlog(blog);

    req.app
      .get("io")
      ?.to(`blog_${blog._id}`)
      .emit("blogUpdated", blog);

    const commentOwner = await User.findById(comment.user);
    const link = getCommentLink(blog._id, comment._id);

    if (commentOwner?.email !== user.email) {
      await sendEmail({
        to: commentOwner.email,
        subject: "↩️ New Reply",
        html: `
          <p>${user.name} replied:</p>
          <blockquote>${text}</blockquote>

          <a href="${link}"
             style="padding:10px 18px;background:#ea580c;color:#fff;text-decoration:none;border-radius:6px;">
             View Reply
          </a>
        `,
      });
    }

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("REPLY ERROR:", err);
    res.status(500).json({ message: "Reply failed" });
  }
};

/* ======================================================
   📄 GET BLOGS
====================================================== */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    console.error("GET BLOGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* ======================================================
   📄 GET SINGLE BLOG
====================================================== */
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog)
      return res.status(404).json({ message: "Blog not found" });

    blog.reactions = ensureArray(blog.reactions);
    blog.comments = ensureArray(blog.comments);

    blog.comments.forEach((c) => {
      c.reactions = ensureArray(c.reactions);
      c.replies = ensureArray(c.replies);
      c.replies.forEach(
        (r) => (r.reactions = ensureArray(r.reactions))
      );
    });

    res.json(blog);
  } catch (err) {
    console.error("GET BLOG ERROR:", err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};
