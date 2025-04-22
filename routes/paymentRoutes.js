const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

// 🔹 Stripe Card Payment Route
router.post(
  "/checkout/stripe",
  authMiddleware.protect,
  paymentController.stripeCheckout
);

// 🔹 Cash on Delivery (COD) Route
router.post(
  "/checkout/cod",
  authMiddleware.protect,
  paymentController.codCheckout
);

module.exports = router;
