# Project Structure Documentation

## Overview
This is a full-stack MERN (MongoDB, Express, React, Node.js) travel booking platform called **Argo**.

## Folder Structure

```
website-project/
├── backend/                    # Node.js/Express backend
│   ├── models/                # MongoDB schemas
│   │   ├── User.js           # User model with authentication
│   │   ├── Trip.js           # Trip/Route model
│   │   └── Booking.js        # Booking model
│   ├── routes/               # API route handlers
│   │   ├── auth.js          # Authentication routes (signup, login)
│   │   ├── trips.js         # Trip management routes
│   │   ├── bookings.js      # Booking routes
│   │   └── admin.js         # Admin-only routes
│   ├── middleware/           # Custom middleware
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
└── frontend/                  # React frontend
    ├── public/               # Static assets
    ├── src/
    │   ├── components/       # Reusable UI components
    │   │   ├── Navbar.js    # Navigation bar with auth state
    │   │   ├── Footer.js    # Footer component
    │   │   ├── TripCard.js  # Reusable trip display card
    │   │   ├── BookingCard.js  # Reusable booking display card
    │   │   ├── PrivateRoute.js # Route protection for authenticated users
    │   │   ├── AdminRoute.js   # Route protection for admin users
    │   │   ├── ErrorBoundary.js # React error boundary
    │   │   ├── Alert.js         # Reusable alert/notification component
    │   │   └── Loading.js       # Reusable loading spinner
    │   │
    │   ├── pages/            # Page components (views)
    │   │   ├── Home.js       # Landing page with trip search
    │   │   ├── Login.js      # User login page
    │   │   ├── SignUp.js     # User registration page
    │   │   ├── MyBookings.js # User's bookings page
    │   │   ├── Profile.js    # User profile management
    │   │   └── Admin.js      # Admin dashboard
    │   │
    │   ├── context/          # React Context API
    │   │   └── AuthContext.js # Global authentication state
    │   │
    │   ├── App.js            # Main app component with routing
    │   ├── index.js          # React entry point
    │   └── index.css         # Global styles
    │
    ├── package.json          # Frontend dependencies
    └── README.md             # Project documentation
```

## Architecture Decisions

### 1. **State Management** ✅
- **Context API** for global authentication state
- Local component state for UI interactions
- **Benefits**: Avoids prop drilling, centralized auth logic

**Implementation:**
- `AuthContext.js` manages user authentication, login, signup, logout
- Provides loading states to prevent flashing content
- Token stored in localStorage with automatic header injection

### 2. **Routing** ✅
- **React Router v6** for client-side routing
- Protected routes with `PrivateRoute` and `AdminRoute` wrappers
- 404 handling with catch-all redirect

**Routes:**
- Public: `/`, `/login`, `/signup`
- Protected: `/my-bookings`, `/profile`
- Admin-only: `/admin`

### 3. **Error Handling** ✅
- **ErrorBoundary** component catches React errors
- API error handling with try-catch blocks
- User-friendly error messages via Alert component
- Form validation on both client and server

### 4. **Responsiveness** ✅
- Mobile-first CSS with breakpoints at 768px and 480px
- Flexbox and CSS Grid for layouts
- Touch-friendly button sizes
- Responsive typography scaling

### 5. **Component Reusability** ✅
- **Atomic design principles**
- Prop-driven components for flexibility
- Shared components: Alert, Loading, TripCard, BookingCard

**Reusable Components:**
- `TripCard`: Display trip information consistently
- `BookingCard`: Show booking details with status
- `Alert`: Notification system for success/error/info
- `Loading`: Loading states across the app

### 6. **HTML/CSS Structure** ✅
- Semantic HTML elements (`<nav>`, `<section>`, `<article>`)
- BEM-inspired naming conventions for CSS classes
- Modular CSS files (one per component)
- CSS variables for consistent theming

**CSS Organization:**
- Component-specific CSS files
- Global styles in `index.css`
- Consistent color palette and spacing

### 7. **Backend Architecture** ✅
- RESTful API design
- JWT-based authentication
- Role-based access control (user/admin)
- Mongoose ODM for MongoDB

**API Endpoints:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `GET /api/trips` - Get all trips (with filters)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User's bookings
- `GET /api/admin/users` - Admin: Get all users
- `POST /api/admin/trips` - Admin: Create trip

## Key Features

### User Features
1. **Authentication**: Signup, login, logout with JWT
2. **Trip Search**: Filter trips by location and date
3. **Booking Management**: View upcoming and past bookings
4. **Profile Management**: Update personal information

### Admin Features
1. **User Management**: View all users
2. **Trip Management**: Create, update, delete trips
3. **Booking Overview**: View all bookings system-wide

## Technology Stack

### Frontend
- **React 18.2**: UI library
- **React Router 6**: Client-side routing
- **Axios**: HTTP client
- **React Icons**: Icon library
- **CSS3**: Styling (no CSS frameworks for custom design)

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

## Best Practices Implemented

1. ✅ **Separation of Concerns**: Clear separation between components, pages, and business logic
2. ✅ **DRY Principle**: Reusable components and utilities
3. ✅ **Error Handling**: Comprehensive error boundaries and try-catch blocks
4. ✅ **Security**: Password hashing, JWT authentication, input validation
5. ✅ **Responsive Design**: Mobile-first approach with multiple breakpoints
6. ✅ **Code Organization**: Logical folder structure with clear naming
7. ✅ **State Management**: Centralized auth state with Context API
8. ✅ **API Design**: RESTful endpoints with proper HTTP methods
9. ✅ **User Experience**: Loading states, error messages, form validation

## Running the Project

See `START.md` for detailed setup and running instructions.

## Future Improvements

- Add unit and integration tests
- Implement payment processing
- Add email notifications
- Implement real-time seat availability
- Add trip reviews and ratings
- Implement password reset functionality
- Add admin analytics dashboard
