import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/trips?${params}`);
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (searchData.from) filters.from = searchData.from;
    if (searchData.to) filters.to = searchData.to;
    if (searchData.date) filters.date = searchData.date;
    fetchTrips(filters);
  };

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };


  return (
    <div className="home-page">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Next Journey</h1>
          <p>Discover available trips and book your seats with ease</p>
          
          <div className="search-box">
            <form onSubmit={handleSearch}>
              <div className="search-inputs">
                <div className="input-group">
                  <label>From</label>
                  <input
                    type="text"
                    name="from"
                    placeholder="Departure Location"
                    value={searchData.from}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="input-group">
                  <label>To</label>
                  <input
                    type="text"
                    name="to"
                    placeholder="Arrival Location"
                    value={searchData.to}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={searchData.date}
                    onChange={handleInputChange}
                  />
                </div>
                
                <button type="submit" className="btn-search">
                  Search Trips
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="trips-section">
        <div className="container">
          <h2>Available Trips</h2>
          <p className="section-subtitle">
            Choose from our carefully selected destinations and enjoy a comfortable journey
          </p>

          {loading ? (
            <div className="loading">Loading trips...</div>
          ) : (
            <div className="trips-grid">
              {trips.length > 0 ? (
                trips.map(trip => (
                  <TripCard key={`${trip._id}-${trip.price}-${trip.availableSeats}`} trip={trip} />
                ))
              ) : (
                <p className="no-trips">No trips found. Try adjusting your search criteria.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
