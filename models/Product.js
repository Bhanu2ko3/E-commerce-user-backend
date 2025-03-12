const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Change id to _id
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
