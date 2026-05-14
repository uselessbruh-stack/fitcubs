import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send the form data to a backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        }, 3000);
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>Have questions? We'd love to hear from you!</p>
                </div>
            </section>

            <section className="section contact-content">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Information */}
                        <div className="contact-info">
                            <h2>Get In Touch</h2>
                            <p>
                                Whether you have questions about registration, categories, or the event itself,
                                our team is here to help. Feel free to reach out through any of the channels below.
                            </p>

                            <div className="contact-cards">
                                <div className="contact-card">
                                    <div className="contact-icon">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Location</h3>
                                        <p>JP Nagar, Bangalore</p>
                                        <p className="venue-info">
                                            <strong>Event Venue:</strong><br />
                                            Attal Bihari Vajpayee,<br />
                                            BBMP HSR Ground
                                        </p>
                                        <a href="https://maps.app.goo.gl/uc2FrJhAFTHbKvXL8" target="_blank" rel="noopener noreferrer" className="map-link">
                                            View on Google Maps
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-card">
                                    <div className="contact-icon">
                                        <FaPhone />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Phone</h3>
                                        <a href="tel:+917757867207">+91 77578 67207</a>
                                        <p>Mon-Sat, 9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>

                                <div className="contact-card">
                                    <div className="contact-icon">
                                        <FaEnvelope />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Email</h3>
                                        <a href="mailto:thefitcubs@gmail.com">thefitcubs@gmail.com</a>
                                        <p>We'll respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="contact-card">
                                    <div className="contact-icon">
                                        <FaGlobe />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Website</h3>
                                        <a href="https://www.thefitcubs.com" target="_blank" rel="noopener noreferrer">
                                            www.thefitcubs.com
                                        </a>
                                        <p>Visit our main website</p>
                                    </div>
                                </div>

                                <div className="contact-card">
                                    <div className="contact-icon">
                                        <FaPhone />
                                    </div>
                                    <div className="contact-details">
                                        <h3>Phone</h3>
                                        <p>Contact through email for inquiries</p>
                                        <p className="contact-note">We respond to emails promptly</p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="faq-section">
                                <h3>Frequently Asked Questions</h3>
                                <div className="faq-item">
                                    <h4>Q: What is the registration deadline?</h4>
                                    <p>A: We recommend registering at least 2 weeks before the event date to ensure availability.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Q: Can parents run with older children?</h4>
                                    <p>A: Parents can accompany children in categories marked "With Parents". Solo categories are for children only.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Q: What if it rains on the event day?</h4>
                                    <p>A: The event will proceed rain or shine. In case of severe weather, we'll notify all participants via email.</p>
                                </div>
                                <div className="faq-item">
                                    <h4>Q: Is the registration fee refundable?</h4>
                                    <p>A: Registration fees are non-refundable, but you can transfer your registration to another child.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <div className="contact-form-box">
                                <h2>Send Us a Message</h2>

                                {submitted ? (
                                    <div className="success-message">
                                        <div className="success-icon">✓</div>
                                        <h3>Thank You!</h3>
                                        <p>Your message has been sent successfully. We'll get back to you soon!</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="contact-form">
                                        <div className="form-group">
                                            <label htmlFor="name">Your Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your.email@example.com"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Your contact number"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="subject">Subject *</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="What is this about?"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="message">Message *</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                placeholder="Type your message here..."
                                                rows="5"
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-large">
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map/Additional Info */}
            <section className="section event-location">
                <div className="container">
                    <h2 className="section-title">Event Location</h2>
                    <p className="section-subtitle">Atal Bihari Vajpayee Stadium, HSR Layout, Bangalore</p>

                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0947823456!2d77.6421976!3d12.910998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae158980c91f1d%3A0x3c1d31b4dde9a3fe!2sAtal%20Bihari%20Vajpayee%20Stadium!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin"
                            width="100%"
                            height="450"
                            style={{ border: 0, borderRadius: '12px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Event Location Map"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
