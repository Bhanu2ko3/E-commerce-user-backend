const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware.protect, cartController.addToCart);
router.get("/", authMiddleware.protect, cartController.getCart);
router.put("/update", authMiddleware.protect, cartController.updateCartItem);
router.delete("/remove/:productId", authMiddleware.protect, cartController.removeCartItem);
router.delete("/clear", authMiddleware.protect, cartController.clearCart);

module.exports = router;
