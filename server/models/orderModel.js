const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;