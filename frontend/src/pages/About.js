import React from 'react';
import { FaTrophy, FaRunning, FaUsers, FaGamepad, FaUtensils } from 'react-icons/fa';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1>About The Fit Cubs Kids Mini Marathon 2025</h1>
                    <p className="hero-tagline">
                        A Joyful Celebration of Children's Fitness & Family Bonding
                    </p>
                </div>
            </section>

            {/* About Fit Cubs */}
            <section className="section">
                <div className="container">
                    <div className="content-box">
                        <h2>About The Fit Cubs</h2>
                        <p>
                            <strong>The Fit Cubs</strong> is a leading multi-sports and fitness program for children
                            aged 2–10 years, dedicated to building physical literacy, discipline, teamwork, and
                            confidence through fun-based activities.
                        </p>
                        <p>
                            We work with schools across Bangalore to integrate fitness into early learning,
                            helping children develop healthy habits from a young age. Our programs are designed
                            by experts to ensure age-appropriate activities that promote overall development.
                        </p>
                        <div className="info-grid">
                            <div className="info-item">
                                <strong>Location:</strong> <a href="https://maps.app.goo.gl/KQvpDrQJXhy82WXr8" target="_blank" rel="noopener noreferrer">HSR Layout, Bangalore</a>
                            </div>
                            <div className="info-item">
                                <strong>Phone:</strong> <a href="tel:+917757867207">+91 77578 67207</a>
                            </div>
                            <div className="info-item">
                                <strong>Website:</strong> <a href="https://www.thefitcubs.com" target="_blank" rel="noopener noreferrer">www.thefitcubs.com</a>
                            </div>
                            <div className="info-item">
                                <strong>Email:</strong> <a href="mailto:thefitcubs@gmail.com">thefitcubs@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About the Event */}
            <section className="section event-details">
                <div className="container">
                    <h2 className="section-title">About the Event</h2>

                    <div className="event-info-grid">
                        <div className="event-info-card">
                            <div className="card-icon">📅</div>
                            <h3>Date</h3>
                            <p>7th December 2025</p>
                        </div>
                        <div className="event-info-card">
                            <div className="card-icon">📍</div>
                            <h3>Venue</h3>
                            <p>Attal Bihari Vajpayee,<br />BBMP HSR Ground</p>
                            <a href="https://maps.app.goo.gl/uc2FrJhAFTHbKvXL8" target="_blank" rel="noopener noreferrer" className="map-link" style={{ fontSize: '14px', marginTop: '8px', display: 'inline-block' }}>
                                View on Map
                            </a>
                        </div>
                        <div className="event-info-card">
                            <div className="card-icon">👥</div>
                            <h3>Participants</h3>
                            <p>3000+ Parents and Kids Expected</p>
                        </div>
                        <div className="event-info-card">
                            <div className="card-icon">🏃</div>
                            <h3>Age Group</h3>
                            <p>1.5 – 15 years</p>
                        </div>
                    </div>

                    <div className="content-box" style={{ marginTop: '40px' }}>
                        <h3>What Makes This Marathon Special?</h3>
                        <p>
                            The Fit Cubs Kids Mini Marathon 2025 is not just a race – it's a celebration of
                            childhood, fitness, and family bonding. Designed for children from toddlers to teens,
                            this event offers multiple categories to ensure every child can participate at their
                            comfort level.
                        </p>
                        <p>
                            Whether it's parents walking alongside their little ones or older kids racing
                            independently, this marathon creates memories that last a lifetime while promoting
                            an active and healthy lifestyle.
                        </p>
                    </div>
                </div>
            </section>

            {/* Run Categories */}
            <section className="section categories-detail">
                <div className="container">
                    <h2 className="section-title">Run Categories</h2>

                    <div className="categories-list">
                        <div className="category-detail-card sold-out">
                            <div className="sold-out-ribbon">SOLD OUT</div>
                            <div className="category-badge">1.5 - 2 Years</div>
                            <h4>60 MTR Walk</h4>
                            <p className="category-mode">With Parents</p>
                            <p className="category-timing">🏁 Flag-off: 8:30 AM</p>
                            <p>Perfect for toddlers taking their first steps into the world of running!</p>
                        </div>

                        <div className="category-detail-card">
                            <div className="category-badge">2 - 3 Years</div>
                            <h4>100 MTR Walk/Run</h4>
                            <p className="category-mode">With Parents</p>
                            <p className="category-timing">🏁 Flag-off: 8:30 AM</p>
                            <p>A gentle introduction to running with parental support.</p>
                        </div>

                        <div className="category-detail-card">
                            <div className="category-badge">3 - 5 Years</div>
                            <h4>100 MTR Walk/Run</h4>
                            <p className="category-mode">With Parents</p>
                            <p className="category-timing">🏁 Flag-off: 8:30 AM</p>
                            <p>Building confidence with every step alongside mom and dad.</p>
                        </div>

                        <div className="category-detail-card">
                            <div className="category-badge">5 - 7 Years</div>
                            <h4>200 MTR Run</h4>
                            <p className="category-mode">Solo</p>
                            <p className="category-timing">🏁 Flag-off: 8:30 AM</p>
                            <p>First solo adventure! Watch your child race independently.</p>
                        </div>

                        <div className="category-detail-card">
                            <div className="category-badge">7 - 10 Years</div>
                            <h4>400 MTR Run</h4>
                            <p className="category-mode">Solo</p>
                            <p className="category-timing">🏁 Flag-off: 8:30 AM</p>
                            <p>A competitive distance for energetic kids!</p>
                        </div>

                        <div className="category-detail-card sold-out">
                            <div className="sold-out-ribbon">SOLD OUT</div>
                            <div className="category-badge">10 - 13 Years</div>
                            <h4>800 MTR Open Run</h4>
                            <p className="category-mode">Open Run</p>
                            <p className="category-timing">🏁 Flag-off: 8:30 AM</p>
                            <p>Challenge yourself in this exciting open category!</p>
                        </div>

                        <div className="category-detail-card sold-out">
                            <div className="sold-out-ribbon">SOLD OUT</div>
                            <div className="category-badge">13 - 15 Years</div>
                            <h4>1 KM Open Run</h4>
                            <p className="category-mode">Open Run</p>
                            <p className="category-timing">🏁 Flag-off: 8:30 AM</p>
                            <p>The ultimate challenge for young athletes!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Highlights */}
            <section className="section highlights-detail">
                <div className="container">
                    <h2 className="section-title">Event Highlights</h2>

                    <div className="highlights-grid">
                        <div className="highlight-detail-card">
                            <FaTrophy className="highlight-icon" />
                            <h3>Certificates & Medals</h3>
                            <p>Every participant receives a medal and certificate to celebrate their achievement!</p>
                        </div>

                        <div className="highlight-detail-card">
                            <FaRunning className="highlight-icon" />
                            <h3>Branded T-shirts</h3>
                            <p>High-quality marathon T-shirts for all registered participants.</p>
                        </div>

                        <div className="highlight-detail-card">
                            <FaGamepad className="highlight-icon" />
                            <h3>Fun Games & Activities</h3>
                            <p>Exciting games, stalls, and entertainment zones for the whole family.</p>
                        </div>

                        <div className="highlight-detail-card">
                            <FaUsers className="highlight-icon" />
                            <h3>Family Zone</h3>
                            <p>Dedicated area for families to relax, bond, and enjoy the event together.</p>
                        </div>

                        <div className="highlight-detail-card">
                            <div className="highlight-icon" style={{ fontSize: '48px' }}>🎵</div>
                            <h3>Live Music</h3>
                            <p>Energetic music and entertainment throughout the event to keep spirits high!</p>
                        </div>

                        <div className="highlight-detail-card">
                            <FaUtensils className="highlight-icon" />
                            <h3>Food & Refreshments</h3>
                            <p>Snack boxes, fresh juice, water, and optional breakfast add-ons.</p>
                        </div>

                        <div className="highlight-detail-card">
                            <div className="highlight-icon" style={{ fontSize: '48px' }}>🎪</div>
                            <h3>Sponsor Booths</h3>
                            <p>Explore stalls from our partners and sponsors with exciting offerings.</p>
                        </div>

                        <div className="highlight-detail-card">
                            <div className="highlight-icon" style={{ fontSize: '48px' }}>🏫</div>
                            <h3>Preschool Showcase</h3>
                            <p>Meet our associated preschools and learn about their programs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Schedule & Dress Code */}
            <section className="section" style={{ background: '#f5f9fc' }}>
                <div className="container">
                    <h2 className="section-title">Event Schedule & Dress Code</h2>

                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#35AEBF', marginBottom: '20px', fontSize: '24px' }}>⏰ Event Timing</h3>
                            <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
                                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>📍 Reporting Time:</strong> 8:00 AM</p>
                                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>👕 T-Shirt Collection:</strong> 8:00 AM onwards</p>
                                <p style={{ fontSize: '18px', marginBottom: '0' }}><strong>🏁 Event Start Time:</strong> 8:30 AM (All Categories)</p>
                            </div>
                            <p style={{ marginTop: '15px', color: '#666', fontStyle: 'italic' }}>
                                ⚠️ Please arrive by 8:00 AM for registration check-in and T-shirt collection at the venue.
                            </p>
                        </div>

                        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#35AEBF', marginBottom: '20px', fontSize: '24px' }}>👔 Dress Code</h3>

                            <div style={{ marginBottom: '25px', padding: '20px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                                <h4 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '20px' }}>For Kids:</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ marginBottom: '10px', fontSize: '16px' }}>✅ <strong>Sports Shoes</strong> (mandatory)</li>
                                    <li style={{ marginBottom: '10px', fontSize: '16px' }}>✅ <strong>Black or Blue Full Track Pants</strong></li>
                                    <li style={{ fontSize: '16px' }}>✅ <strong>Event T-shirt</strong> (will be provided at venue at 8 AM)</li>
                                </ul>
                            </div>

                            <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
                                <h4 style={{ color: '#1565c0', marginBottom: '15px', fontSize: '20px' }}>For Parents:</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ marginBottom: '10px', fontSize: '16px' }}>✅ <strong>White T-shirt</strong></li>
                                    <li style={{ marginBottom: '10px', fontSize: '16px' }}>✅ <strong>Track Pants or Jeans</strong></li>
                                    <li style={{ fontSize: '16px' }}>✅ <strong>Sports Shoes or Comfortable Footwear</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Participate */}
            <section className="section why-participate">
                <div className="container">
                    <h2 className="section-title">Why Participate?</h2>

                    <div className="reasons-grid">
                        <div className="reason-card">
                            <div className="reason-number">1</div>
                            <h3>Promote Healthy Habits</h3>
                            <p>Instill the love for fitness and physical activity from an early age.</p>
                        </div>

                        <div className="reason-card">
                            <div className="reason-number">2</div>
                            <h3>Build Confidence</h3>
                            <p>Help your child gain confidence through achievement and participation.</p>
                        </div>

                        <div className="reason-card">
                            <div className="reason-number">3</div>
                            <h3>Family Bonding</h3>
                            <p>Create lasting memories while spending quality time together.</p>
                        </div>

                        <div className="reason-card">
                            <div className="reason-number">4</div>
                            <h3>Meet New Friends</h3>
                            <p>Connect with other families and build a community around fitness.</p>
                        </div>

                        <div className="reason-card">
                            <div className="reason-number">5</div>
                            <h3>Win Exciting Prizes</h3>
                            <p>Compete for cash prizes and trophies in each category!</p>
                        </div>

                        <div className="reason-card">
                            <div className="reason-number">6</div>
                            <h3>Fun & Entertainment</h3>
                            <p>Enjoy a day filled with music, games, food, and celebration.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Venue Map Section */}
            <section className="section venue-section">
                <div className="container">
                    <h2 className="section-title">Event Venue Location</h2>
                    <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '40px' }}>
                        Atal Bihari Vajpayee Stadium, HSR Layout, Bangalore
                    </p>

                    <div className="venue-map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0947823456!2d77.6421976!3d12.910998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae158980c91f1d%3A0x3c1d31b4dde9a3fe!2sAtal%20Bihari%20Vajpayee%20Stadium!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin"
                            width="100%"
                            height="450"
                            style={{ border: 0, borderRadius: '12px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Event Venue Location"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2>Ready to Join?</h2>
                        <p>Register now and secure your child's spot in this amazing event!</p>
                        <a href="/register" className="btn btn-primary btn-large">Register Now</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
