// server/middleware/roles.js

/**
 * 🔐 ADMIN MIDDLEWARE
 * Used for Admin Blog Panel (Create / Edit / Delete Blogs)
 */
export const requireAdmin = (req, res, next) => {
  try {
    // req.user comes from requireAuth middleware
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Admin authorization failed",
    });
  }
};

/**
 * 🎓 STUDENT MIDDLEWARE
 * Used for student-only routes
 */
export const isStudent = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({
        message: "Students only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Student authorization failed",
    });
  }
};

/**
 * 🛡 GENERIC ROLE CHECKER (OPTIONAL – FUTURE USE)
 * Example: requireRole("admin"), requireRole("student")
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: `${role} access only`,
      });
    }
    next();
  };
};
