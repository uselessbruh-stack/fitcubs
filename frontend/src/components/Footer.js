import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>THE FIT CUBS</h3>
                        <p>Building Champions, One Step at a Time</p>
                        <p className="footer-description">
                            A leading multi-sports and fitness program for children aged 2–10 years,
                            dedicated to building physical literacy, discipline, teamwork, and confidence.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About Event</a></li>
                            <li><a href="/register">Register Now</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="https://www.thefitcubs.com" target="_blank" rel="noopener noreferrer">Visit Main Website</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Info</h4>
                        <div className="contact-item">
                            <FaMapMarkerAlt className="icon" />
                            <span>JP Nagar, Bangalore</span>
                        </div>
                        <div className="contact-item">
                            <FaPhone className="icon" />
                            <a href="tel:+917757867207">+91 77578 67207</a>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="icon" />
                            <a href="mailto:thefitcubs@gmail.com">thefitcubs@gmail.com</a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Event Details</h4>
                        <p><strong>Date:</strong> 7th December 2025</p>
                        <p><strong>Venue:</strong> Attal Bihari Vajpayee, BBMP HSR Ground</p>
                        <p>
                            <a href="https://maps.app.goo.gl/uc2FrJhAFTHbKvXL8" target="_blank" rel="noopener noreferrer" style={{ color: '#9CBC1D', fontSize: '14px' }}>
                                View Location on Map →
                            </a>
                        </p>
                        <p><strong>Expected Participants:</strong> 1000+ Families</p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><FaFacebook /></a>
                            <a href="#" aria-label="Instagram"><FaInstagram /></a>
                            <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 The Fit Cubs. All rights reserved.</p>
                    <p>Powered by passion for children's fitness and well-being</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
