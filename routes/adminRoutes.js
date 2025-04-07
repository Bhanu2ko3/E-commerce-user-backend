const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

//Get All Users (Admin Only)
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

//Update User Role (Admin Only)
router.put("/user/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = req.body.role || user.role; // Update role
    await user.save();

    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error });
  }
});

module.exports = router;
