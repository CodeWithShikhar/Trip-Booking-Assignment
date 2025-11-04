import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlane, FaBus, FaCalendar, FaClock, FaTicketAlt, FaTimes } from 'react-icons/fa';
import './BookingCard.css';

const BookingCard = ({ booking, isUpcoming, onCancelSuccess }) => {
  const navigate = useNavigate();
  const [cancelling, setCancelling] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };


  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const Icon = isUpcoming ? FaPlane : FaBus;

  return (
    <div className={`booking-card ${isUpcoming ? 'upcoming' : 'completed'}`}>
      <div className="booking-header">
        <div className="booking-id-section">
          <span className="booking-label">Booking ID: {booking.bookingId}</span>
          <span className={getStatusClass(booking.status)}>{booking.status}</span>
        </div>
        <Icon className="booking-icon" />
      </div>

      <div className="booking-content">
        <div className="booking-route">
          <FaPlane className="route-icon" />
          <span>{booking.tripRoute}</span>
        </div>

        <div className="booking-info-row">
          <div className="booking-info-item">
            <FaCalendar />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="booking-info-item">
            <FaClock />
            <span>{booking.tripId?.departureTime || '08:30 AM'} - {booking.tripId?.arrivalTime || '01:30 PM'}</span>
          </div>
        </div>

        <div className="booking-seats">
          <span>Seats: {booking.seats.join(', ')}</span>
        </div>
      </div>

      <div className="booking-visual">
        <Icon className="booking-large-icon" />
      </div>

      <div className="booking-footer">
        <div className="booking-price">
          <span className="price-label">Total Paid:</span>
          <span className="price-value">${booking.totalPrice?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="booking-actions">
          <button 
            className="btn-view-ticket"
            onClick={handleViewTicket}
          >
            <FaTicketAlt /> View Ticket
          </button>
          {isUpcoming && booking.status !== 'Cancelled' && (
            <button 
              className="btn-cancel"
              onClick={handleCancelBooking}
              disabled={cancelling}
            >
              <FaTimes /> {cancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  async function handleCancelBooking() {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelling(true);
    try {
      await axios.put(`/api/bookings/${booking._id}/cancel`);
      alert('Booking cancelled successfully');
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  }

  function handleViewTicket() {
    navigate('/booking-confirmation', {
      state: {
        booking,
        trip: booking.tripId,
        selectedSeats: booking.seats,
        totalPrice: booking.totalPrice
      }
    });
  }
};

export default BookingCard;
