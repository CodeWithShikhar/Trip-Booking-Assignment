# Argo - Travel Booking Platform (MERN Stack)

A complete travel booking web application built with MongoDB, Express.js, React, and Node.js.

## Features

### User Features
- **Authentication**: Sign up and login with secure password hashing
- **Home Page**: Browse and search available trips
- **Trip Search**: Filter trips by departure location, arrival location, and date
- **My Bookings**: View upcoming and past bookings
- **Profile Page**: Manage user profile and view booking history

### Admin Features
- **Admin Dashboard**: Overview statistics (total trips, bookings, upcoming departures)
- **Trip Management**: Create, edit, and delete trips
- **Booking Management**: View all bookings, verify QR codes, manage booking status
- **User Management**: Track all user bookings and activities

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Context API** - State management

## Project Structure

```
website-project/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Trip.js
│   │   └── Booking.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── trips.js
│   │   ├── bookings.js
│   │   └── admin.js
│   ├── middleware/      # Auth middleware
│   │   └── auth.js
│   ├── .env.example     # Environment variables template
│   ├── server.js        # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/  # Reusable components
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   ├── TripCard.js
    │   │   ├── BookingCard.js
    │   │   ├── PrivateRoute.js
    │   │   └── AdminRoute.js
    │   ├── context/     # React Context
    │   │   └── AuthContext.js
    │   ├── pages/       # Page components
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── SignUp.js
    │   │   ├── MyBookings.js
    │   │   ├── Profile.js
    │   │   └── Admin.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/argo-travel
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start MongoDB (if using local):
```bash
mongod
```

6. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Default Admin Setup

To create an admin user, you can either:

1. **Manual Method**: Register a user normally, then update the `isAdmin` field in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

2. **Or** modify the User model temporarily to set `isAdmin: true` during signup.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Trips
- `GET /api/trips` - Get all trips (with filters)
- `GET /api/trips/:id` - Get single trip

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard stats (admin)
- `GET /api/admin/trips` - Get all trips (admin)
- `POST /api/admin/trips` - Create trip (admin)
- `PUT /api/admin/trips/:id` - Update trip (admin)
- `DELETE /api/admin/trips/:id` - Delete trip (admin)
- `GET /api/admin/bookings` - Get all bookings (admin)
- `PUT /api/admin/bookings/:id` - Update booking (admin)
- `DELETE /api/admin/bookings/:id` - Delete booking (admin)

## Sample Data

To add sample trips for testing, use MongoDB shell or Compass:

```javascript
db.trips.insertMany([
  {
    tripId: "T001",
    from: "New York",
    to: "Boston",
    route: "New York → Boston",
    departureTime: "06:00 AM",
    arrivalTime: "04:00 PM",
    departureDate: new Date("2024-12-15"),
    price: 48,
    originalPrice: 84,
    discount: 43,
    totalSeats: 50,
    availableSeats: 12,
    duration: "2h 15min",
    rating: 4,
    reviews: 126,
    isPopular: true
  },
  {
    tripId: "T002",
    from: "Chicago",
    to: "Los Angeles",
    route: "Chicago → Los Angeles",
    departureTime: "08:30 AM",
    arrivalTime: "03:00 PM",
    departureDate: new Date("2024-12-18"),
    price: 156,
    originalPrice: 198,
    discount: 21,
    totalSeats: 50,
    availableSeats: 8,
    duration: "5h 45min",
    rating: 4,
    reviews: 189,
    isPopular: false
  }
])
```

## Features in Detail

### Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users
- Role-based access control (Admin vs User)

### Trip Search & Filtering
- Search by departure location
- Search by arrival location
- Filter by date
- Display available seats, prices, and ratings

### Booking System
- Create new bookings
- Automatic seat availability management
- View booking history
- Separate upcoming and past bookings

### Admin Dashboard
- Real-time statistics
- Complete trip management (CRUD)
- Booking management
- QR code verification for bookings

## Color Scheme

- Primary Blue: `#2563eb`
- Background: `#f9fafb`
- Text Dark: `#1f2937`
- Text Gray: `#6b7280`
- Success Green: `#10b981`
- Error Red: `#ef4444`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Set `PORT=3001` before running `npm start`

### CORS Issues
- Backend already has CORS enabled
- Check proxy setting in frontend `package.json`

## Future Enhancements

- Payment gateway integration
- Email notifications
- Real-time seat availability
- Reviews and ratings system
- Map integration for routes
- Mobile responsive improvements
- Push notifications
- Multi-language support

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
