// routes/cart.js

const express = require('express');
const router = express.Router();
const Cart = require('../models/orderModel');
const Product = require('../models/productModel')

router.get('/userProducts', async (req, res) => {
  try {
    const userId = req.query.userId;
    const cartItems = await Cart.find({ userId  });
    const productIds = cartItems.map(item => item.productId);

    if (productIds.length > 0) {
      const products = await Product.find({ _id: { $in: productIds } });
      // Map cart items to include amount attribute for each product
      const cartItemsWithAmount = cartItems.map(item => {
        const product = products.find(p => p._id.equals(item.productId));
        return {
          ...product.toObject(),
          quantity: item.quantity,
          amount: product.price * item.quantity
        };
      });
      res.status(200).send({ data: cartItemsWithAmount });
    } else {
      res.status(200).send({ data: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error' });
  }
});

router.get('/cart_delete', async (req, res) => {
  const userId = req.query.userId;
  const productId = req.query.productId;

  try {
    const cartItem = await Cart.findOneAndDelete({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Cart item deleted successfully', cartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to add product to cart
router.post('/addProduct', async (req, res) => {
  const userId=req.query.userId;
  const productId=req.query.productId;
  const quantity=req.query.quantity;
  try {
    // Check if cart item already exists
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // Update quantity of existing cart item
      cartItem.quantity += parseInt(quantity);
      cartItem.updatedAt = new Date();
    } else {
      // Create new cart item
      cartItem = new Cart({
        userId,
        productId,
        quantity: parseInt(quantity),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Save cart item to database
    await cartItem.save();

    res.status(200).json({ message: 'Product added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;