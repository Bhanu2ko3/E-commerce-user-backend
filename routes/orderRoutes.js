const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// Check if orderController functions are properly imported
if (!orderController.createOrder) {
  throw new Error("createOrder is not defined in orderController");
}
if (!orderController.getOrders) {
  throw new Error("getOrders is not defined in orderController");
}
if (!orderController.getOrderById) {
  throw new Error("getOrderById is not defined in orderController");
}
if (!orderController.getOrdersByUser) {
  throw new Error("getOrdersByUser is not defined in orderController");
}
if (!orderController.updateOrderStatus) {
  throw new Error("updateOrderStatus is not defined in orderController");
}

// Routes
router.post("/", authMiddleware.protect, orderController.createOrder);
router.get("/", authMiddleware.protect, orderController.getOrders);
router.get("/:id", authMiddleware.protect, orderController.getOrderById);
router.get(
  "/user/:userId",
  authMiddleware.protect,
  orderController.getOrdersByUser
);
router.put(
  "/:id/status",
  authMiddleware.protect,
  orderController.updateOrderStatus
);

module.exports = router;
