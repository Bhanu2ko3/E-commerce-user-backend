exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next(); // Proceed if user is admin
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  };
  