// controllers/productController.js
const Product = require("../models/Product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    console.log("Fetching products..."); // Debug log
    const products = await Product.find();
    console.log("Found products:", products.length); // Debug log
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (for testing)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};