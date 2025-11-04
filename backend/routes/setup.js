const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/setup/list-users
// @desc    List all users (for debugging)
// @access  Public (remove this route after setup)
router.get('/list-users', async (req, res) => {
  try {
    const users = await User.find({}, 'fullName email isAdmin');
    res.json({ count: users.length, users });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/setup/make-admin
// @desc    Make a user admin (for initial setup only)
// @access  Public (remove this route after setup)
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ 
      message: 'User is now an admin',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
