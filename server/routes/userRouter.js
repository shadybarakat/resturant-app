const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');

// Route for creating a new user
router.post('/register', async (req, res) => {
  const name = req.query.name;
  const email = req.query.email;
  const password = req.query.password;
  const isAdmin=req.query.isAdmin;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'user already exist' });
    }

    const id = mongoose.Types.ObjectId();
    // Create new user
    const newUser = new User({
      _id:id,
      name,
      email,
      password,
      isAdmin,

    });

    // Save new user to database
    await newUser.save();

    // Send response with new user data
    res.status(201).json('Successful register!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;