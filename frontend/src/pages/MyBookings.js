import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingCard from '../components/BookingCard';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    booking => new Date(booking.date) >= new Date() && booking.status !== 'Completed'
  );

  const pastBookings = bookings.filter(
    booking => new Date(booking.date) < new Date() || booking.status === 'Completed'
  );

  return (
    <div className="my-bookings-page">
      <Navbar />
      
      <div className="page-content">
        <div className="container">
          <h1>Upcoming Bookings</h1>
          
          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : upcomingBookings.length > 0 ? (
            <div className="bookings-grid">
              {upcomingBookings.map(booking => (
                <BookingCard 
                  key={booking._id} 
                  booking={booking} 
                  isUpcoming={true}
                  onCancelSuccess={fetchBookings}
                />
              ))}
            </div>
          ) : (
            <p className="no-bookings">No upcoming bookings</p>
          )}

          <h1 className="past-bookings-title">Past Bookings</h1>
          
          {pastBookings.length > 0 ? (
            <div className="bookings-grid">
              {pastBookings.map(booking => (
                <BookingCard key={booking._id} booking={booking} isUpcoming={false} />
              ))}
            </div>
          ) : (
            <p className="no-bookings">No past bookings</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;
