const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('../controllers/productController');

// Define Routes
router.post('/', createProduct); // Create Product
router.get('/', authMiddleware.protect, productController.getProducts); // Get All Products
router.get('/:id', getProductById); // Get Product by ID
router.put('/:id', updateProductById); // Update Product by ID
router.delete('/:id', deleteProductById); // Delete Product by ID

module.exports = router;
