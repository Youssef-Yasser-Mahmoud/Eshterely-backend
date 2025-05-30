const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");
const CART_LIMIT = 20;

// GET user's cart
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("cart");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.cart);
  } catch (error) {
    console.error("Cart fetch error:", error);
    res.status(500).json({ message: "Failed to retrieve cart" });
  }
});

// PUT (add/update) product in cart
router.put("/", auth, async (req, res) => {
  try {
    const { product, quantity = 1 } = req.body;

    // Basic validation
    if (!product || !product._id || !product.category) {
      return res.status(400).json({ message: "Product data is required" });
    }

    if (quantity < 1 || quantity > 10) {
      return res
        .status(400)
        .json({ message: "Quantity must be between 1 and 10" });
    }

    // Check cart limit
    const user = await User.findById(req.user._id);
    if (user.cart.length >= CART_LIMIT) {
      return res.status(400).json({
        message: `Cart limit reached (max ${CART_LIMIT} items)`,
      });
    }

    // Check if product already exists in cart
    const existingIndex = user.cart.findIndex(
      (item) =>
        item._id.toString() === product._id &&
        item.category === product.category
    );

    if (existingIndex >= 0) {
      // Update existing item
      user.cart[existingIndex].quantity = quantity;
    } else {
      // Add new item
      user.cart.push({
        ...product,
        quantity,
        addedAt: new Date(),
      });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.error("Cart update error:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// DELETE product from cart
router.delete("/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const initialCount = user.cart.length;
    user.cart = user.cart.filter(
      (item) => item._id.toString() !== req.params.productId
    );

    if (user.cart.length === initialCount) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.error("Cart delete error:", error);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// DELETE all products from cart
router.delete("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.json({ message: "Cart cleared successfully", cart: user.cart });
  } catch (error) {
    console.error("Cart clear error:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

module.exports = router;
