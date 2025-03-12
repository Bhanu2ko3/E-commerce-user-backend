const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Define Routes
router.post('/', createProduct); // Create Product
router.get('/', getProducts); // Get All Products
router.get('/:id', getProductById); // Get Product by ID
router.put('/:id', updateProduct); // Update Product by ID
router.delete('/:id', deleteProduct); // Delete Product by ID

module.exports = router;
