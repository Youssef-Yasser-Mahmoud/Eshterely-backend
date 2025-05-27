const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    itemPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingInfo: shippingInfoSchema,
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
