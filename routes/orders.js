const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const auth = require("../middlewares/auth");

// Get all orders (with optional user filter)
router.get("/", auth, async (req, res) => {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get single order by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Create new order
router.post("/", auth, async (req, res) => {
  try {
    const { items, total, shippingInfo } = req.body;
    console.log("items", items);
    console.log("total", total);
    console.log("shippingInfo", shippingInfo);

    if (!shippingInfo) {
      return res
        .status(400)
        .json({ message: "Shipping information is required" });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      total,
      shippingInfo,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Update order status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// Update order details
router.put("/:id", auth, async (req, res) => {
  try {
    const { items, total, status, shippingInfo } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow updates if order is pending
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot modify non-pending orders" });
    }

    order.items = items || order.items;
    order.total = total || order.total;
    order.status = status || order.status;
    order.shippingInfo = shippingInfo || order.shippingInfo;

    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

// Delete order
router.delete("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow deletion of pending orders
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot delete non-pending orders" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
