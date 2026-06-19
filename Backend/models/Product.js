// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: 'fas fa-pills' },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  badge: { type: String },
  stock: { type: Number, default: 100 },
  requiresPrescription: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);