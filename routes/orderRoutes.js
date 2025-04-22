const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

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
