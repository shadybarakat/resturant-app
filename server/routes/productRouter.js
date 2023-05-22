const express = require('express')

const router = express.Router()

const Product = require('../models/productModel')

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).send({ data: products})
    } catch (err) {
        res.status(400).send({ error: err})
    }
})

router.get('/products-by-categories', async(req, res) => {
    try {

        const products = await Product.aggregate([
            { $match: {}},
            { $group: {
                _id: '$category',
                products: { $push: '$$ROOT'}
            }},
            { $project: { name: '$_id', products: 1, _id: 0}}
        ])
        res.status(200).send({ data: products})
    } catch (err) {
        res.status(400).send({ error: err})
    }
})


// DELETE route to delete a product by ID
router.get('/product_delete', async (req, res) => {
  try {
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
   // If product is found, delete it
    await product.remove();
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// POST route to add a new product
router.post('/add', async (req, res) => {
  try {
    const { name, adjective, description, price, categoryId, categoryName } = req.query; // Change from 'category' to 'categoryId' and 'categoryName'
    const product = new Product({
      name,
      adjective,
      description,
      price,
      category: { // Add category object to product
        _id: categoryId,
        name: categoryName
      }
    });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router