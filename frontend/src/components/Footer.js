import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#safety">Safety</a></li>
            <li><a href="#guidelines">Guidelines</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <a href="#facebook"><FaFacebookF /></a>
          <a href="#linkedin"><FaLinkedinIn /></a>
          <a href="#instagram"><FaInstagram /></a>
          <a href="#twitter"><FaTwitter /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 TravelPro. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
