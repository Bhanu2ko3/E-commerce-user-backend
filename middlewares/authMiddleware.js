const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Token not provided." });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Ensure JWT secret is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");
      return res
        .status(500)
        .json({ error: "Server error. Authentication misconfigured." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Validate user ID format
    if (!decoded.userId || !mongoose.isValidObjectId(decoded.userId)) {
      return res
        .status(400)
        .json({ error: "Invalid user ID format in token." });
    }

    // Fetch user and exclude password field
    const user = await User.findById(decoded.userId).select("-password");
    console.log("User from DB:", user);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User does not exist." });
    }

    // Attach user info to request object
    req.user = { id: user._id, role: user.role };

    next();
  } catch (err) {
    console.error("Authentication Error:", err);

    let errorMessage = "Token is invalid or expired. Please log in again.";
    let statusCode = 403;

    switch (err.name) {
      case "JsonWebTokenError":
        errorMessage = "Invalid token. Access denied.";
        break;
      case "TokenExpiredError":
        errorMessage = "Session expired. Please log in again.";
        statusCode = 401;
        break;
      case "CastError":
        errorMessage = "Invalid user ID format in token.";
        statusCode = 400;
        break;
      default:
        errorMessage = "Authentication failed.";
    }

    return res.status(statusCode).json({ error: errorMessage });
  }
};
