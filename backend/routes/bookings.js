const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { verifyToken } = require('../middleware/auth');

// Generate booking ID
const generateBookingId = () => {
  return 'B' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    const { tripId, seats } = req.body;

    // Find trip
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check seat availability
    if (trip.availableSeats < seats.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Create booking
    const booking = new Booking({
      bookingId: generateBookingId(),
      userId: req.user._id,
      tripId: trip._id,
      userName: req.user.fullName,
      tripRoute: trip.route,
      date: trip.departureDate,
      seats,
      totalPrice: trip.price * seats.length,
      status: 'Confirmed'
    });

    await booking.save();

    // Update available seats
    trip.availableSeats -= seats.length;
    await trip.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('tripId')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('tripId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user (or user is admin)
    if (booking.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if already cancelled
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Update booking status
    booking.status = 'Cancelled';
    await booking.save();

    // Return seats to trip
    const trip = await Trip.findById(booking.tripId);
    if (trip) {
      trip.availableSeats += booking.seats.length;
      await trip.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
