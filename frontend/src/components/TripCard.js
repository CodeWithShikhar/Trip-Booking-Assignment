import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaUsers, FaCalendar, FaStar } from 'react-icons/fa';
import './TripCard.css';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
    ));
  };

  return (
    <div className="trip-card">
      {trip.isPopular && <span className="badge badge-popular">Popular</span>}
      {trip.discount > 0 && (
        <span className="badge badge-discount">{trip.discount}% OFF</span>
      )}
      
      <div className="trip-image">
        {trip.image ? (
          <img 
            src={trip.image.startsWith('http') ? trip.image : `http://localhost:5500${trip.image}`} 
            alt={trip.route}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80';
            }}
          />
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80" 
            alt={trip.route}
          />
        )}
      </div>

      <div className="trip-details">
        <div className="trip-rating">
          {renderStars(Math.round(trip.rating))}
          <span className="rating-text">({trip.reviews} reviews)</span>
        </div>

        <h3 className="trip-route">{trip.route}</h3>

        <div className="trip-info">
          <div className="info-item">
            <FaClock />
            <span>{trip.duration}</span>
          </div>
          <div className="info-item">
            <FaUsers />
            <span>{trip.availableSeats} seats available</span>
          </div>
          <div className="info-item">
            <FaCalendar />
            <span>{formatDate(trip.departureDate)}</span>
          </div>
        </div>

        <div className="trip-footer">
          <div className="trip-price">
            <span className="price-current">${trip.price}</span>
            {trip.originalPrice && (
              <span className="price-original">${trip.originalPrice}</span>
            )}
          </div>
          <button className="btn-book" onClick={() => navigate(`/trip/${trip._id}`)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
