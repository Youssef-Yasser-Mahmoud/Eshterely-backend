// models/user.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minlength: 3, maxlength: 50 },
  last_name: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 255 },
  isAdmin: { type: Boolean, default: false },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  cart: {
    type: Array,
    default: [],
  },
  previouslyPurchased: {
    type: Array,
    default: [],
  },
});

// JWT Token Generation Method
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.SECRET_KEY
  );
};

// Password Reset Token Generation
userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetTokenExpiry = Date.now() + 1000 * 60 * 60;
  return token;
};

module.exports = mongoose.model("User", userSchema);
