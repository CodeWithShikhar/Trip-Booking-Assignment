import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPlane, FaTicketAlt, FaClock, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './Admin.css';

const Admin = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBookings: 0,
    upcomingDepartures: 0
  });
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all or bookings
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({
    from: '',
    to: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, tripsRes, bookingsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/trips'),
        axios.get('/api/admin/bookings')
      ]);
      
      setStats(statsRes.data);
      setTrips(tripsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`/api/admin/trips/${tripId}`);
        setTrips(trips.filter(t => t._id !== tripId));
      } catch (error) {
        alert('Error deleting trip');
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`/api/admin/bookings/${bookingId}`);
        setBookings(bookings.filter(b => b._id !== bookingId));
      } catch (error) {
        alert('Error deleting booking');
      }
    }
  };

  const handleVerifyQR = async (bookingId, currentStatus) => {
    try {
      await axios.put(`/api/admin/bookings/${bookingId}`, {
        qrVerified: !currentStatus
      });
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, qrVerified: !currentStatus } : b
      ));
    } catch (error) {
      alert('Error updating booking');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip({ ...newTrip, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTrip({ ...newTrip, image: file });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      // Calculate duration from departure and arrival times
      const calculateDuration = (depTime, arrTime) => {
        const [depHours, depMinutes] = depTime.split(':').map(Number);
        const [arrHours, arrMinutes] = arrTime.split(':').map(Number);
        const depMinutesTotal = depHours * 60 + depMinutes;
        const arrMinutesTotal = arrHours * 60 + arrMinutes;
        let durationMinutes = arrMinutesTotal - depMinutesTotal;
        if (durationMinutes < 0) durationMinutes += 24 * 60;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        return `${hours}h ${minutes}m`;
      };

      const tripData = {
        from: newTrip.from,
        to: newTrip.to,
        route: `${newTrip.from} to ${newTrip.to}`,
        departureDate: new Date(newTrip.date),
        departureTime: newTrip.departureTime,
        arrivalTime: newTrip.arrivalTime,
        duration: calculateDuration(newTrip.departureTime, newTrip.arrivalTime),
        price: parseFloat(newTrip.price),
        totalSeats: parseInt(newTrip.totalSeats),
        availableSeats: parseInt(newTrip.totalSeats),
        rating: 4.5,
        reviews: 0,
        isPopular: false
      };

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('tripData', JSON.stringify(tripData));
      if (newTrip.image) {
        formData.append('image', newTrip.image);
      }

      const response = await axios.post('/api/admin/trips', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setTrips([...trips, response.data]);
      setShowAddModal(false);
      resetForm();
      alert('Trip added successfully!');
    } catch (error) {
      console.error('Error adding trip:', error);
      alert('Error adding trip. Please try again.');
    }
  };

  const resetForm = () => {
    setNewTrip({
      from: '',
      to: '',
      date: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      totalSeats: '',
      image: null
    });
    setImagePreview(null);
    setEditingTrip(null);
  };

  const handleEditTrip = (trip) => {
    // Format date for input (YYYY-MM-DD)
    const formattedDate = new Date(trip.departureDate).toISOString().split('T')[0];
    
    setEditingTrip(trip);
    setNewTrip({
      from: trip.from || trip.route?.split(' to ')[0] || '',
      to: trip.to || trip.route?.split(' to ')[1] || '',
      date: formattedDate,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      price: trip.price,
      totalSeats: trip.totalSeats,
      image: null
    });
    setImagePreview(trip.image ? `http://localhost:5500${trip.image}` : null);
    setShowEditModal(true);
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      const calculateDuration = (depTime, arrTime) => {
        const [depHours, depMinutes] = depTime.split(':').map(Number);
        const [arrHours, arrMinutes] = arrTime.split(':').map(Number);
        const depMinutesTotal = depHours * 60 + depMinutes;
        const arrMinutesTotal = arrHours * 60 + arrMinutes;
        let durationMinutes = arrMinutesTotal - depMinutesTotal;
        if (durationMinutes < 0) durationMinutes += 24 * 60;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        return `${hours}h ${minutes}m`;
      };

      const tripData = {
        from: newTrip.from,
        to: newTrip.to,
        route: `${newTrip.from} to ${newTrip.to}`,
        departureDate: new Date(newTrip.date),
        departureTime: newTrip.departureTime,
        arrivalTime: newTrip.arrivalTime,
        duration: calculateDuration(newTrip.departureTime, newTrip.arrivalTime),
        price: parseFloat(newTrip.price),
        totalSeats: parseInt(newTrip.totalSeats)
      };

      const formData = new FormData();
      formData.append('tripData', JSON.stringify(tripData));
      if (newTrip.image) {
        formData.append('image', newTrip.image);
      }

      const response = await axios.put(`/api/admin/trips/${editingTrip._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setTrips(trips.map(t => t._id === editingTrip._id ? response.data : t));
      setShowEditModal(false);
      resetForm();
      alert('Trip updated successfully!');
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Error updating trip. Please try again.');
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      
      <div className="admin-content">
        <div className="container">
          <h1>Admin Dashboard</h1>
          
          <section className="admin-overview">
            <h2>Admin Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: '#E8F4FD'}}>
                  <FaPlane color="#2563EB" />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalTrips}</h3>
                  <p>Total Trips</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: '#D1FAE5'}}>
                  <FaTicketAlt color="#10B981" />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalBookings}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: '#FEF3C7'}}>
                  <FaClock color="#F59E0B" />
                </div>
                <div className="stat-info">
                  <h3>{stats.upcomingDepartures}</h3>
                  <p>Upcoming Departures</p>
                </div>
              </div>
            </div>
          </section>

          <section className="trip-management">
            <div className="section-header">
              <h2>Trip Management</h2>
              <div className="header-actions">
                <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('all')}>
                  All Trips
                </button>
                <button className="btn-add-trip" onClick={() => setShowAddModal(true)}>+ Add New Trip</button>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Route</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Price</th>
                      <th>Total Seats</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map(trip => (
                      <tr key={trip._id}>
                        <td>{trip.tripId}</td>
                        <td>{trip.route}</td>
                        <td>{trip.departureTime}</td>
                        <td>{trip.arrivalTime}</td>
                        <td>${typeof trip.price === 'number' ? trip.price.toFixed(2) : parseFloat(trip.price || 0).toFixed(2)}</td>
                        <td>{trip.totalSeats}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon btn-edit"
                                    onClick={() => handleEditTrip(trip)}>
                              <FaEdit /> Edit
                            </button>
                            <button className="btn-icon btn-delete" 
                                    onClick={() => handleDeleteTrip(trip._id)}>
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="booking-management">
            <div className="section-header">
              <h2>Booking Management</h2>
              <div className="header-actions">
                <button className="tab-btn active">All Bookings</button>
                <button className="btn-secondary">Verify QR</button>
              </div>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Trip Route</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>QR Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.userName}</td>
                      <td>{booking.tripRoute}</td>
                      <td>{formatDate(booking.date)}</td>
                      <td>{booking.seats.join(', ')}</td>
                      <td>
                        <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`verify-btn ${booking.qrVerified ? 'verified' : ''}`}
                          onClick={() => handleVerifyQR(booking._id, booking.qrVerified)}
                        >
                          {booking.qrVerified ? <FaCheckCircle /> : <FaTimesCircle />}
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon btn-edit">
                            <FaEdit /> Edit
                          </button>
                          <button className="btn-icon btn-delete"
                                  onClick={() => handleDeleteBooking(booking._id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <Footer />

      {/* Add Trip Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trip Details</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddTrip}>
              <div className="form-grid">
                <div className="form-group">
                  <label>From</label>
                  <input
                    type="text"
                    name="from"
                    placeholder="Departure Location"
                    value={newTrip.from}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>To</label>
                  <input
                    type="text"
                    name="to"
                    placeholder="Arrival Destination"
                    value={newTrip.to}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date & Time</label>
                  <input
                    type="date"
                    name="date"
                    value={newTrip.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newTrip.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Departure Time</label>
                  <input
                    type="time"
                    name="departureTime"
                    value={newTrip.departureTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Arrival Time</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={newTrip.arrivalTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Total no. of seats</label>
                  <input
                    type="number"
                    name="totalSeats"
                    placeholder="Total no. of seats"
                    value={newTrip.totalSeats}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Trip Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{padding: '8px'}}
                  />
                  {imagePreview && (
                    <div style={{marginTop: '12px'}}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-submit-modal">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trip Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => { setShowEditModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Trip</h2>
              <button className="modal-close" onClick={() => { setShowEditModal(false); resetForm(); }}>×</button>
            </div>
            
            <form onSubmit={handleUpdateTrip}>
              <div className="form-grid">
                <div className="form-group">
                  <label>From</label>
                  <input
                    type="text"
                    name="from"
                    placeholder="Departure Location"
                    value={newTrip.from}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>To</label>
                  <input
                    type="text"
                    name="to"
                    placeholder="Arrival Destination"
                    value={newTrip.to}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newTrip.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newTrip.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Departure Time</label>
                  <input
                    type="time"
                    name="departureTime"
                    value={newTrip.departureTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Arrival Time</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={newTrip.arrivalTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Total no. of seats</label>
                  <input
                    type="number"
                    name="totalSeats"
                    placeholder="Total no. of seats"
                    value={newTrip.totalSeats}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Trip Image (Optional - leave empty to keep current)</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{padding: '8px'}}
                  />
                  {imagePreview && (
                    <div style={{marginTop: '12px'}}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-submit-modal">
                Update Trip
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
