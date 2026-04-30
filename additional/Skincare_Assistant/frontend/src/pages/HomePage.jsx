import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container animate-fade-in" style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        Your Personal <span className="text-gradient">Skincare Assistant</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        Build routines, track consistency, and get tailored product recommendations based on your unique skin profile.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/signup" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Start Your Journey
        </Link>
        <Link to="/login" className="glass-card" style={{ padding: '1rem 2rem', color: 'var(--color-text-main)', fontWeight: '600', textDecoration: 'none' }}>
          I already have an account
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
