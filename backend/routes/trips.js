const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// @route   GET /api/trips
// @desc    Get all trips with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let query = {};

    if (from) query.from = new RegExp(from, 'i');
    if (to) query.to = new RegExp(to, 'i');
    if (date) {
      const searchDate = new Date(date);
      query.departureDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const trips = await Trip.find(query).sort({ departureDate: 1 });
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
