const Order = require("../models/Order");

// Create New Order
exports.createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products array is required and cannot be empty" });
    }
    if (!totalPrice || isNaN(totalPrice)) {
      return res.status(400).json({ message: "Valid totalPrice is required" });
    }

    // Ensure the request contains user details (from authentication middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    // Create new order
    const newOrder = new Order({
      user: req.user.id, // Attach the user ID from the authenticated request
      products,
      totalPrice,
      status: "Pending", // Default status for new orders
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Orders
exports.getOrders = async (req, res) => {
  try {
    const order = await Order.find();
    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch Orders", details: err.message });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(id)
      .populate("user", "name email") // Populate user details
      .populate("products.product", "name price"); // Populate product details

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Orders for a User
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ user: userId }).populate(
      "products.product",
      "name price"
    ); // Populate product details

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Order Status (Admin Only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
