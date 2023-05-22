console.log(req);
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const app = express();
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate the email and password
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Authenticate the user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (password !== user.password) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate a token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Return the response
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});



module.exports = app;