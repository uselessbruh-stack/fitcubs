import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-wrapper">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        <span className="logo-text">THE FIT CUBS</span>
                        <span className="logo-subtitle">Kids Mini Marathon 2025</span>
                    </Link>

                    <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
                        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                        <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
                        <Link to="/register" className="nav-link nav-link-register" onClick={closeMenu}>Register Now</Link>
                        <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
                    </div>

                    <div className="hamburger" onClick={toggleMenu}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
