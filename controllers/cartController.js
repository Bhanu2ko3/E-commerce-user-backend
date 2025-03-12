const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
      const { productId, quantity } = req.body;

      // 🔹 Validate `productId` format
      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ error: "Invalid product ID format." });
      }

      // 🔹 Find the product
      const product = await Product.findById(new mongoose.Types.ObjectId(productId));
      if (!product) {
          return res.status(404).json({ error: "Product not found." });
      }

      // 🔹 Get user from `req.user`
      const userId = req.user.id;

      // 🔹 Check if cart exists for user
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
          // 🔹 Create a new cart
          cart = new Cart({
              user: new mongoose.Types.ObjectId(userId),
              items: [],
              totalPrice: 0
          });
      }

      // 🔹 Check if product is already in cart
      const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      
      if (existingItemIndex !== -1) {
          // 🔹 Update quantity if item exists
          cart.items[existingItemIndex].quantity += quantity;
      } else {
          // 🔹 Add new item to cart
          cart.items.push({ product: new mongoose.Types.ObjectId(productId), quantity });
      }

      // 🔹 Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => {
          return total + (item.quantity * product.price);
      }, 0);

      // 🔹 Save cart
      await cart.save();

      res.status(200).json({ message: "Product added to cart successfully!", cart });
  } catch (error) {
      console.error("❌ Error adding to cart:", error.message);
      res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// Get user cart with product details
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized access" });

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price image category" // Select only necessary fields
    });

    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};


// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized access" });

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    
    const product = await Product.findById(productId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * (product ? product.price : 0), 0);
    
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized access" });

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    const product = await Product.findById(productId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * (product ? product.price : 0), 0);
    
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing cart item", error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized access" });

    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};
