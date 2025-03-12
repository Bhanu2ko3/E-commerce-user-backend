const Stripe = require("stripe");
const Order = require("../models/Order");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// 🔹 Stripe Card Payment
exports.stripeCheckout = async (req, res) => {
  try {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Create a Stripe charge
    const charge = await stripe.charges.create({
      amount: order.totalPrice * 100, // Stripe uses cents
      currency: "usd",
      source: token,
      description: `Payment for Order ${order._id}`,
    });

    // Update order status to "Paid"
    order.status = "Paid";
    await order.save();

    res.status(200).json({ message: "Payment successful", charge });
  } catch (error) {
    res.status(500).json({ message: "Payment failed", error });
  }
};

// 🔹 Cash on Delivery (COD) Payment
exports.codCheckout = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update order status to "Pending - Cash on Delivery"
    order.status = "Pending - COD";
    await order.save();

    res.status(200).json({ message: "Order placed with Cash on Delivery", order });
  } catch (error) {
    res.status(500).json({ message: "Order processing failed", error });
  }
};
