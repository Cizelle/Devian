// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import the User model
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For authentication

// POST /users/register (Create a new user)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during user registration:", error); // Add this line
    res.status(500).json({ message: error.message });
  }
});

// POST /users/login (Authenticate a user)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // Store JWT_SECRET in .env

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /users/:userId (Retrieve user profile information)
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /users/:userId (Update user profile information)
router.put("/:userId", async (req, res) => {
  try {
    const { username, email, profile } = req.body; // Add profile to the body request.

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username, email, profile },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
