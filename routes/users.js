const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth"); // Import auth middleware

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });
    
    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });

    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      "377fc8160979b9ea861e34a4c2e8c183123b970d74001e091835677588a8bce5",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, expiresIn: 3600 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User Profile
// Get user profile by username
router.get("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("bookings") // Populate the bookings field
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email, address, name, phoneNumber, bio, bookings } = user;

    res.status(200).json({
      username,
      email,
      address,
      profile: {
        name,
        phoneNumber,
        bio,
      },
      bookings: bookings.map((booking) => ({
        id: booking._id,
        name: booking.name, // Assuming the restaurant has a name field
        // Add other relevant fields from the restaurant model
      })),
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});


// Update user profile
router.put("/:id/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields based on request body
    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.profile.address = req.body.address;
    if (req.body.phoneNumber) user.profile.phoneNumber = req.body.phoneNumber;
    if (req.body.bio) user.profile.bio = req.body.bio;
    if (req.body.dateOfBirth) user.profile.dateOfBirth = req.body.dateOfBirth;
    // Add other profile fields as needed

    await user.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", profile: user.profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
