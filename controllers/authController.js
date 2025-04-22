const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register user function
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name && !email && !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error in register:", err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login user function
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input

    if (!email && !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Respond with token
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
};
