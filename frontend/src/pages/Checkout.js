import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Alert from '../components/Alert';
import { FaCreditCard, FaWallet, FaPlane, FaCalendar, FaClock, FaChair, FaMapMarkerAlt, FaLock, FaCheckCircle } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trip, selectedSeats, totalPrice } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  if (!trip || !selectedSeats) {
    navigate('/');
    return null;
  }

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create booking
      const bookingData = {
        tripId: trip._id,
        seats: selectedSeats,
        totalPrice,
        paymentMethod,
        paymentDetails: {
          last4: paymentDetails.cardNumber.slice(-4)
        }
      };

      const response = await axios.post('/api/bookings', bookingData);

      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          booking: response.data,
          trip,
          selectedSeats,
          totalPrice
        }
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-content">
        <div className="container">
          <h1>Checkout & Payment</h1>

          <div className="checkout-grid">
            {/* Left - Payment Form */}
            <div className="payment-section">
              <div className="section-card">
                <div className="card-header">
                  <FaCreditCard />
                  <h2>Payment Information</h2>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form onSubmit={handleSubmit}>
                  <div className="payment-methods">
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={paymentMethod === 'credit'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Credit Card</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="debit"
                        checked={paymentMethod === 'debit'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Debit Card</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>UPI</span>
                    </label>
                  </div>

                  {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                    <>
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNumber}
                          onChange={handleInputChange}
                          maxLength="16"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="John Doe"
                          value={paymentDetails.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentDetails.expiryDate}
                            onChange={handleInputChange}
                            maxLength="5"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            placeholder="123"
                            value={paymentDetails.cvv}
                            onChange={handleInputChange}
                            maxLength="3"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="form-group">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        required
                      />
                    </div>
                  )}

                  <div className="security-note">
                    <FaLock />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <button type="submit" className="btn-pay" disabled={loading}>
                    {loading ? 'Processing...' : `Pay $${totalPrice}`}
                  </button>
                </form>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="summary-section">
              <div className="section-card">
                <h2>Order Summary</h2>

                <div className="trip-summary">
                  <h3>{trip.route}</h3>
                  <p className="trip-date">{new Date(trip.date).toLocaleDateString()}</p>
                  <p className="trip-time">{trip.departureTime} - {trip.arrivalTime}</p>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span>Selected Seats</span>
                    <span className="seats-list">{selectedSeats.join(', ')}</span>
                  </div>

                  <div className="detail-row">
                    <span>Number of Seats</span>
                    <span className="bold">{selectedSeats.length}</span>
                  </div>

                  <div className="detail-row">
                    <span>Price per Seat</span>
                    <span>${trip.price}</span>
                  </div>

                  <div className="detail-row subtotal">
                    <span>Subtotal</span>
                    <span>${totalPrice}</span>
                  </div>

                  <div className="detail-row">
                    <span>Taxes & Fees</span>
                    <span>$0</span>
                  </div>

                  <div className="detail-row total">
                    <span>Total Amount</span>
                    <span className="total-price">${totalPrice}</span>
                  </div>
                </div>

                <div className="benefits">
                  <h4>What you get:</h4>
                  <ul>
                    <li><FaCheckCircle /> Confirmed booking</li>
                    <li><FaCheckCircle /> E-ticket via email</li>
                    <li><FaCheckCircle /> Free cancellation up to 24hrs</li>
                    <li><FaCheckCircle /> 24/7 customer support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
