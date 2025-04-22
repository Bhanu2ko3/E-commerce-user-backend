const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Protected route with proper response handling
router.get("/protected", protect, (req, res) => {
  try {
    res.status(200).json({
      message:
        "This is a protected route. Only authorized users can access this.",
      user: req.user, // The user information is set in the middleware (authMiddleware.js)
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
