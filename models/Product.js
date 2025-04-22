const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
