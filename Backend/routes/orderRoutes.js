const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderCount
} = require("../controllers/orderController");

// Create new order
router.post("/", createOrder);

// Get user's orders
router.get("/", getOrders);

// Get specific order
router.get("/:id", getOrderById);

// Update order status (admin)
router.put("/:id/status", updateOrderStatus);

// Cancel order
router.put("/:id/cancel", cancelOrder);

// Get order count
router.get("/count", getOrderCount);

module.exports = router;