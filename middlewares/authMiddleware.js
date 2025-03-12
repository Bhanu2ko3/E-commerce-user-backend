const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized. Token not provided." });
        }

        const token = authHeader.split(" ")[1];

        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in environment variables.");
            return res.status(500).json({ error: "Server error. Authentication misconfigured." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔹 Decoded Token:", decoded);

        if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
            return res.status(400).json({ error: "Invalid user ID format in token." });
        }

        const user = await User.findById(new mongoose.Types.ObjectId(decoded.userId)).select("-password");
        console.log("🔹 User from DB:", user);

        if (!user) {
            return res.status(401).json({ error: "Unauthorized. User does not exist. Check MongoDB!" });
        }

        req.user = { id: user._id, role: user.role };

        next();
    } catch (err) {
        console.error("❌ Authentication Error:", err.message);

        let message = "Token is invalid or expired. Please log in again.";
        let status = 403;

        if (err.name === "JsonWebTokenError") {
            message = "Invalid token. Access denied.";
        } else if (err.name === "TokenExpiredError") {
            message = "Session expired. Please log in again.";
            status = 401;
        } else if (err.name === "CastError") {
            message = "Invalid user ID format in token.";
            status = 400;
        }

        return res.status(status).json({ error: message });
    }
};
