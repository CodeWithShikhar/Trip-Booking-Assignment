import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { FaPlane, FaMapMarkerAlt, FaCalendar, FaClock, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './TripDetails.css';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`/api/trips/${id}`);
      // Initialize bookedSeats if it doesn't exist
      const tripData = {
        ...response.data,
        bookedSeats: response.data.bookedSeats || []
      };
      setTrip(tripData);
    } catch (error) {
      setError('Failed to load trip details. Please try again.');
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateSeats = () => {
    const seats = [];
    const rows = 10;
    const cols = 4;
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seatNumber = `${String.fromCharCode(65 + col)}${row}`;
        seats.push(seatNumber);
      }
    }
    return seats;
  };

  const handleSeatClick = (seat) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (trip.bookedSeats && trip.bookedSeats.includes(seat)) {
      return; // Seat already booked
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length >= trip.availableSeats) {
        setError(`You can only select up to ${trip.availableSeats} seats`);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
      setError('');
    }
  };

  const getSeatStatus = (seat) => {
    if (trip.bookedSeats && trip.bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    navigate('/checkout', {
      state: {
        trip,
        selectedSeats,
        totalPrice: trip.price * selectedSeats.length
      }
    });
  };

  if (loading) {
    return <Loading fullScreen message="Loading trip details..." />;
  }

  if (!trip) {
    return (
      <div>
        <Navbar />
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h2>Trip not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const allSeats = generateSeats();

  return (
    <div className="trip-details-page">
      <Navbar />

      <div className="trip-details-content">
        <div className="container">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Trips
          </button>

          <div className="trip-details-grid">
            {/* Left Side - Trip Information */}
            <div className="trip-info-section">
              <div className="trip-header">
                <FaPlane className="trip-icon-large" />
                <h1>{trip.route}</h1>
              </div>

              {error && <Alert type="error" message={error} onClose={() => setError('')} />}

              <div className="trip-info-cards">
                <div className="info-card">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <label>Route</label>
                    <p>{trip.from} → {trip.to}</p>
                  </div>
                </div>

                <div className="info-card">
                  <FaCalendar className="info-icon" />
                  <div>
                    <label>Date</label>
                    <p>{formatDate(trip.date)}</p>
                  </div>
                </div>

                <div className="info-card">
                  <FaClock className="info-icon" />
                  <div>
                    <label>Timing</label>
                    <p>{trip.departureTime} - {trip.arrivalTime}</p>
                  </div>
                </div>

                <div className="info-card">
                  <FaDollarSign className="info-icon" />
                  <div>
                    <label>Price per Seat</label>
                    <p className="price">${trip.price}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div>
                    <label>Available Seats</label>
                    <p className="available-count">{trip.availableSeats} seats</p>
                  </div>
                </div>
              </div>

              {trip.description && (
                <div className="trip-description">
                  <h3>About this trip</h3>
                  <p>{trip.description}</p>
                </div>
              )}
            </div>

            {/* Right Side - Seat Selection */}
            <div className="seat-selection-section">
              <div className="seat-selection-card">
                <h2>Select Your Seats</h2>
                <p className="seat-instruction">Click on available seats to select</p>

                <div className="seat-legend">
                  <div className="legend-item">
                    <div className="seat-demo available"></div>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat-demo selected"></div>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat-demo booked"></div>
                    <span>Booked</span>
                  </div>
                </div>

                <div className="seat-map">
                  <div className="seat-map-header">Front</div>
                  <div className="seats-grid">
                    {allSeats.map((seat, index) => (
                      <React.Fragment key={seat}>
                        <button
                          className={`seat ${getSeatStatus(seat)}`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={trip.bookedSeats.includes(seat)}
                        >
                          {seat}
                        </button>
                        {(index + 1) % 4 === 2 && <div className="aisle"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="selection-summary">
                    <div className="summary-row">
                      <span>Selected Seats:</span>
                      <span className="selected-seats-list">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="summary-row">
                      <span>Number of Seats:</span>
                      <span className="bold">{selectedSeats.length}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount:</span>
                      <span className="price-large">${trip.price * selectedSeats.length}</span>
                    </div>
                  </div>
                )}

                <button
                  className="btn-proceed"
                  onClick={handleProceedToCheckout}
                  disabled={selectedSeats.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripDetails;
