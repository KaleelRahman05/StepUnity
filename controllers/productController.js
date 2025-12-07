// productController.js
const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    // Apply member discount logic
    const productsWithPrice = products.map(product => {
      const productObj = product.toObject();
      
      if (req.user && req.user.membershipStatus) {
        productObj.finalPrice = product.discountedPrice || product.price;
        productObj.isMember = true;
      } else {
        productObj.finalPrice = product.price;
        productObj.isMember = false;
      }
      
      return productObj;
    });
    
    res.json({
      success: true,
      data: productsWithPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const productObj = product.toObject();
    
    if (req.user && req.user.membershipStatus) {
      productObj.finalPrice = product.discountedPrice || product.price;
      productObj.isMember = true;
    } else {
      productObj.finalPrice = product.price;
      productObj.isMember = false;
    }
    
    res.json({
      success: true,
      data: productObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product (Admin only - can add admin role later)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
