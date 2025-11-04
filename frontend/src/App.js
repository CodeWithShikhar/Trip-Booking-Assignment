import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import TripDetails from './pages/TripDetails';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <PrivateRoute>
                  <BookingConfirmation />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
