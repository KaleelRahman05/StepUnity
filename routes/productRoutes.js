const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, createProduct);

module.exports = router;
