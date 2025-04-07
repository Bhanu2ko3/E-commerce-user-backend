const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", cartController.addToCart);
router.post("/merge", authMiddleware.protect, cartController.mergeCartOnLogin);
router.get("/", authMiddleware.protect, cartController.getCart);
router.delete("/remove/:productId", authMiddleware.protect, cartController.removeCartItem);
router.delete("/clear", authMiddleware.protect, cartController.clearCart);

module.exports = router;
