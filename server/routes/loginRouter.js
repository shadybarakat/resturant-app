const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const router = express.Router()

router.post('/login', async (req, res) => {
  // console.log(req);
  const email = req.query.email
  const password = req.query.password


  try {
    // Check if user exists
    const user = await User.findOne({ email })
    

    if (!user) {
      return res.status(401).send({ error: 'Invalid ' })
    }


    if (password !== user.password) {
      return res.status(401).send({ error: user })
    }

    // Generate token
    const payload = { userId: user._id };
    const secretKey = 'mysecretkey';
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Return response
    res.status(200).send({ token, user });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router