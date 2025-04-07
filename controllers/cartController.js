const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add product to cart (Guest & Logged-in)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id || null; // Null if guest user

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else {
      cart = await Cart.findOne({ user: null }); // Handle guest cart
    }

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * product.price;
    }, 0);

    await cart.save();
    res
      .status(200)
      .json({ message: "Product added to cart successfully!", cart });
  } catch (error) {
    console.error("❌ Error adding to cart:", error.message);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

// Merge guest cart to user cart on login
exports.mergeCartOnLogin = async (req, res) => {
  try {
    const { guestCart } = req.body;
    const userId = req.user.id;
    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      userCart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    guestCart?.items.forEach((guestItem) => {
      const existingItem = userCart.items.find(
        (item) => item.product.toString() === guestItem.product
      );
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        userCart.items.push({
          product: guestItem.product,
          quantity: guestItem.quantity,
        });
      }
    });

    userCart.totalPrice = userCart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
    await userCart.save();

    res
      .status(200)
      .json({ message: "Cart merged successfully!", cart: userCart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error merging cart", error: error.message });
  }
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized access" });

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price image"
    );
    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized access" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing cart item", error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized access" });

    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};
