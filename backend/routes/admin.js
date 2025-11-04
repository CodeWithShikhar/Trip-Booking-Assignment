const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require admin access
router.use(verifyToken, isAdmin);

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalTrips = await Trip.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const upcomingDepartures = await Trip.countDocuments({
      departureDate: { $gte: new Date() }
    });

    res.json({
      totalTrips,
      totalBookings,
      upcomingDepartures
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/trips
// @desc    Get all trips for admin
// @access  Private/Admin
router.get('/trips', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ departureDate: 1 });
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/trips
// @desc    Create a new trip
// @access  Private/Admin
router.post('/trips', upload.single('image'), async (req, res) => {
  try {
    const tripData = JSON.parse(req.body.tripData);
    
    // Generate trip ID
    tripData.tripId = 'T' + String(await Trip.countDocuments() + 1).padStart(3, '0');
    tripData.availableSeats = tripData.totalSeats;
    
    // Add image path if file was uploaded
    if (req.file) {
      tripData.image = `/uploads/${req.file.filename}`;
    }

    const trip = new Trip(tripData);
    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/admin/trips/:id
// @desc    Update a trip
// @access  Private/Admin
router.put('/trips/:id', upload.single('image'), async (req, res) => {
  try {
    const tripData = JSON.parse(req.body.tripData);
    
    // Add image path if new file was uploaded
    if (req.file) {
      tripData.image = `/uploads/${req.file.filename}`;
    }

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      tripData,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/admin/trips/:id
// @desc    Delete a trip
// @access  Private/Admin
router.delete('/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings for admin
// @access  Private/Admin
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'fullName email')
      .populate('tripId')
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/bookings/:id
// @desc    Update booking (e.g., verify QR, change status)
// @access  Private/Admin
router.put('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/bookings/:id
// @desc    Delete a booking
// @access  Private/Admin
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Return seats to trip
    const trip = await Trip.findById(booking.tripId);
    if (trip) {
      trip.availableSeats += booking.seats.length;
      await trip.save();
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
