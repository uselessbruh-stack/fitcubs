import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaMedal, FaCertificate, FaUtensils, FaGlassWhiskey, FaTshirt, FaRunning, FaUsers, FaGamepad, FaMusic, FaStore, FaIdCard, FaCamera, FaChild } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const soldOutAges = ['1.5 - 2 Years', '10 - 13 Years', '13 - 15 Years'];

    const categories = [
        { age: '1.5 - 2 Years', distance: '60 MTR (Walk)', mode: 'With Parents', fee: 599, flagOff: '8:30 AM' },
        { age: '2 - 3 Years', distance: '100 MTR (Walk/Run)', mode: 'With Parents', fee: 599, flagOff: '8:30 AM' },
        { age: '3 - 5 Years', distance: '100 MTR (Walk/Run)', mode: 'With Parents', fee: 699, flagOff: '8:30 AM' },
        { age: '5 - 7 Years', distance: '200 MTR (Run)', mode: 'Solo', fee: 699, flagOff: '8:30 AM' },
        { age: '7 - 10 Years', distance: '400 MTR (Run)', mode: 'Solo', fee: 699, flagOff: '8:30 AM' },
        { age: '10 - 13 Years', distance: '800 MTR', mode: 'Open Run', fee: 699, flagOff: '8:30 AM' },
        { age: '13 - 15 Years', distance: '1 KM', mode: 'Open Run', fee: 799, flagOff: '8:30 AM' },
    ];

    const prizes = [
        { category: '1.5 - 2 Years (60 MTR)', first: 'Trophy', second: 'Trophy', third: 'Trophy', isTrophy: true },
        { category: '2 - 3 Years (100 MTR)', first: 'Trophy', second: 'Trophy', third: 'Trophy', isTrophy: true },
        { category: '3 - 5 Years (100 MTR)', first: '3000', second: '2000', third: '1000' },
        { category: '5 - 7 Years (200 MTR)', first: '3000', second: '2000', third: '1000' },
        { category: '7 - 10 Years (400 MTR)', first: '5000', second: '3000', third: '2000' },
        { category: '10 - 13 Years (800 MTR)', first: '5000', second: '3000', third: '2000' },
        { category: '13 - 15 Years (1 KM)', first: '5000', second: '3000', third: '2000' },
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay">
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-title">
                                <img src="/images/logo-fit.png" alt="The Fit Cubs Logo" className="hero-logo" />
                                <span className="gradient-text">Kids Mini Marathon 2025</span>
                            </div>
                            <p className="hero-subtitle">
                                A Joyful Celebration of Children's Fitness & Family Bonding
                            </p>
                            <div className="hero-details">
                                <div className="detail-item">
                                    <strong>📅 Date:</strong> 7th December 2025
                                </div>
                                <div className="detail-item">
                                    <strong>📍 Venue:</strong> Attal Bihari Vajpayee, BBMP HSR Ground
                                </div>
                                <div className="detail-item">
                                    <strong>👥 Expected:</strong> 3000+ Parents and Kids
                                </div>
                            </div>
                            <div className="hero-buttons">
                                <Link to="/register" className="btn btn-primary btn-large">
                                    Register Now
                                </Link>
                                <Link to="/about" className="btn btn-secondary btn-large">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="section about-preview">
                <div className="container">
                    <h2 className="section-title">About The Fit Cubs</h2>
                    <p className="section-description">
                        The Fit Cubs is a leading multi-sports and fitness program for children aged 2–10 years,
                        dedicated to building physical literacy, discipline, teamwork, and confidence through
                        fun-based activities. We work with schools across Bangalore to integrate fitness into early learning.
                    </p>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <FaRunning className="stat-icon" />
                            <h3>7 Categories</h3>
                            <p>Age groups from 1.5 to 15 years</p>
                        </div>
                        <div className="stat-card">
                            <FaTrophy className="stat-icon" />
                            <h3>Cash Prizes</h3>
                            <p>For category winners</p>
                        </div>
                        <div className="stat-card">
                            <FaUsers className="stat-icon" />
                            <h3>3000+ Parents and Kids</h3>
                            <p>Expected participants</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <h2 className="section-title">Run Categories & Registration Fees</h2>
                    <div className="categories-grid">
                        {categories.map((cat, index) => {
                            const isSoldOut = soldOutAges.includes(cat.age);
                            return (
                                <div key={index} className={`category-card ${isSoldOut ? 'sold-out' : ''}`}>
                                    <div className="category-header">
                                        <h3>{cat.age}</h3>
                                        <span className="category-mode">{cat.mode}</span>
                                    </div>
                                    <div className="category-body">
                                        <p className="category-distance">{cat.distance}</p>
                                        <p className="category-timing">🏁 Flag-off: {cat.flagOff}</p>
                                        <div className="category-fee">
                                            ₹ {cat.fee}
                                        </div>
                                        {isSoldOut ? (
                                            <button className="btn-select-category" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                Sold Out
                                            </button>
                                        ) : (
                                            <Link to={`/register?category=${encodeURIComponent(cat.age)}`} className="btn-select-category">
                                                Select Category
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="addon-info">
                        <p>🥪 <strong>Add-on:</strong> Breakfast @ ₹99 per person</p>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="section includes-section">
                <div className="container">
                    <h2 className="section-title">What's Included in Registration</h2>
                    <div className="includes-grid">
                        <div className="include-item">
                            <FaTshirt className="include-icon" />
                            <h4>Marathon T-shirt</h4>
                        </div>
                        <div className="include-item">
                            <FaMedal className="include-icon" />
                            <h4>Medal</h4>
                        </div>
                        <div className="include-item">
                            <FaCertificate className="include-icon" />
                            <h4>Certificate</h4>
                        </div>
                        <div className="include-item">
                            <FaUtensils className="include-icon" />
                            <h4>Snack Box</h4>
                        </div>
                        <div className="include-item">
                            <FaGlassWhiskey className="include-icon" />
                            <h4>Fresh Juice & Water</h4>
                        </div>
                        <div className="include-item">
                            <FaIdCard className="include-icon" />
                            <h4>Bibs</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* Prizes Section */}
            <section className="section prizes-section">
                <div className="container">
                    <h2 className="section-title"><FaTrophy style={{ marginRight: '10px', color: 'var(--primary-green)' }} />Winner Cash Prizes & Trophies</h2>
                    <div className="prizes-grid">
                        {prizes.map((prize, index) => (
                            <div key={index} className="prize-card">
                                <h4>{prize.category}</h4>
                                <div className="prize-amounts">
                                    <div className="prize-position gold">
                                        <span className="position">🥇 1st</span>
                                        <span className="amount">{prize.isTrophy ? '🏆 Trophy' : `₹${prize.first}`}</span>
                                    </div>
                                    <div className="prize-position silver">
                                        <span className="position">🥈 2nd</span>
                                        <span className="amount">{prize.isTrophy ? '🏆 Trophy' : `₹${prize.second}`}</span>
                                    </div>
                                    <div className="prize-position bronze">
                                        <span className="position">🥉 3rd</span>
                                        <span className="amount">{prize.isTrophy ? '🏆 Trophy' : `₹${prize.third}`}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Highlights */}
            <section className="section highlights-section">
                <div className="container">
                    <h2 className="section-title">Event Highlights</h2>
                    <div className="highlights-grid">
                        <div className="highlight-card">
                            <FaGamepad className="highlight-icon" />
                            <h3>Fun Games & Activities</h3>
                            <p>Engaging games and activities for all age groups</p>
                        </div>
                        <div className="highlight-card">
                            <FaUsers className="highlight-icon" />
                            <h3>Family Zone</h3>
                            <p>Special area for families to relax and enjoy</p>
                        </div>
                        <div className="highlight-card">
                            <FaMusic className="highlight-icon" />
                            <h3>Music & Entertainment</h3>
                            <p>Live music and entertainment throughout the event</p>
                        </div>
                        <div className="highlight-card">
                            <FaStore className="highlight-icon" />
                            <h3>Stalls & Vendors</h3>
                            <p>Food stalls and sponsor showcase booths</p>
                        </div>
                        <div className="highlight-card">
                            <FaChild className="highlight-icon" />
                            <h3>Fun Activities for Kids</h3>
                            <p>Exciting post-race games and engaging activities for all participants</p>
                        </div>
                        <div className="highlight-card">
                            <FaCamera className="highlight-icon" />
                            <h3>Photo Booths</h3>
                            <p>Capture memories at our photo booths and group photo sessions with medals</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Venue Location Section */}
            <section className="section venue-section">
                <div className="container">
                    <h2 className="section-title">Event Venue</h2>
                    <p className="section-description">
                        Atal Bihari Vajpayee Stadium, BBMP HSR Ground, HSR Layout, Bangalore
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

                    <div className="venue-info-grid">
                        <div className="venue-info-item">
                            <strong>📅 Date:</strong> 7th December 2025
                        </div>
                        <div className="venue-info-item">
                            <strong>🚗 Parking:</strong> Ample parking available
                        </div>
                        <div className="venue-info-item">
                            <strong>♿ Accessibility:</strong> Wheelchair accessible
                        </div>
                        <div className="venue-info-item">
                            <strong>📞 Contact:</strong> <a href="tel:+917757867207">+91 77578 67207</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Join the Marathon?</h2>
                        <p>Register now and be part of this amazing celebration of fitness!</p>
                        <Link to="/register" className="btn btn-primary btn-large">
                            Register Your Child Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
