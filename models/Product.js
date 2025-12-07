// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  image: String,
  category: { type: String, enum: ['Shoes', 'Chains', 'T-shirts', 'Accessories'] },
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);

