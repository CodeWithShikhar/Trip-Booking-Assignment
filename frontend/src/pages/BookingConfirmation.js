import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCheckCircle, FaDownload, FaPrint, FaPlane } from 'react-icons/fa';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, trip, selectedSeats, totalPrice } = location.state || {};

  if (!booking || !trip) {
    navigate('/');
    return null;
  }

  const handleDownloadTicket = () => {
    // Mock ticket download
    const ticketContent = `
=================================
        ARGO TRAVEL TICKET
=================================

Booking ID: ${booking.bookingId || booking._id}
Status: ${booking.status}

Route: ${trip.route}
From: ${trip.from}
To: ${trip.to}

Date: ${new Date(trip.date).toLocaleDateString()}
Departure: ${trip.departureTime}
Arrival: ${trip.arrivalTime}

Seats: ${selectedSeats.join(', ')}
Total Amount: $${totalPrice}

=================================
Thank you for booking with Argo!
=================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `argo-ticket-${booking.bookingId || booking._id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="confirmation-page">
      <Navbar />

      <div className="confirmation-content">
        <div className="container">
          <div className="confirmation-card">
            <div className="success-icon">
              <FaCheckCircle />
            </div>

            <h1>Booking Confirmed!</h1>
            <p className="success-message">
              Your trip has been successfully booked. A confirmation email has been sent to your registered email address.
            </p>

            <div className="booking-id-badge">
              <span>Booking ID:</span>
              <strong>{booking.bookingId || booking._id}</strong>
            </div>

            <div className="ticket-section">
              <div className="ticket-header">
                <FaPlane />
                <h2>Your E-Ticket</h2>
              </div>

              <div className="ticket-details">
                <div className="detail-group">
                  <label>Route</label>
                  <p>{trip.route}</p>
                </div>

                <div className="detail-row-split">
                  <div className="detail-group">
                    <label>From</label>
                    <p>{trip.from}</p>
                  </div>
                  <div className="detail-group">
                    <label>To</label>
                    <p>{trip.to}</p>
                  </div>
                </div>

                <div className="detail-group">
                  <label>Travel Date</label>
                  <p>{new Date(trip.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>

                <div className="detail-row-split">
                  <div className="detail-group">
                    <label>Departure Time</label>
                    <p>{trip.departureTime}</p>
                  </div>
                  <div className="detail-group">
                    <label>Arrival Time</label>
                    <p>{trip.arrivalTime}</p>
                  </div>
                </div>

                <div className="detail-group highlight">
                  <label>Your Seats</label>
                  <p className="seats">{selectedSeats.join(', ')}</p>
                </div>

                <div className="detail-group total">
                  <label>Total Amount Paid</label>
                  <p className="amount">${totalPrice}</p>
                </div>
              </div>

              <div className="ticket-actions">
                <button onClick={handleDownloadTicket} className="btn-action btn-download">
                  <FaDownload /> Download Ticket
                </button>
                <button onClick={handlePrintTicket} className="btn-action btn-print">
                  <FaPrint /> Print Ticket
                </button>
              </div>
            </div>

            <div className="info-section">
              <h3>Important Information</h3>
              <ul>
                <li>Please arrive at least 30 minutes before departure</li>
                <li>Carry a valid ID proof for verification</li>
                <li>Show this e-ticket or booking ID at the counter</li>
                <li>Free cancellation available up to 24 hours before departure</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button onClick={() => navigate('/my-bookings')} className="btn-bookings">
                View All Bookings
              </button>
              <button onClick={() => navigate('/')} className="btn-home">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
