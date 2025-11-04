import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingCard from '../components/BookingCard';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
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
    <div className="profile-page">
      <Navbar />
      
      <div className="page-content">
        <div className="container">
          <section className="profile-header">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <div className="profile-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} />
                ) : (
                  <div className="avatar-placeholder-large">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="profile-details">
                <h3>{user?.fullName}</h3>
                <p className="profile-email">{user?.email}</p>
                <button className="btn-manage-profile">Manage Profile</button>
              </div>
            </div>
          </section>

          <section className="bookings-section">
            <h2>Upcoming Bookings</h2>
            
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

            <h2 className="past-bookings-title">Past Bookings</h2>
            
            {pastBookings.length > 0 ? (
              <div className="bookings-grid">
                {pastBookings.map(booking => (
                  <BookingCard key={booking._id} booking={booking} isUpcoming={false} />
                ))}
              </div>
            ) : (
              <p className="no-bookings">No past bookings</p>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
