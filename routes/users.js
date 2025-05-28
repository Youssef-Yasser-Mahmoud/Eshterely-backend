const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const User = require("../models/user");

// Get current user profile (protected)
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// Get all users (admin only)
router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// dele user by id
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
