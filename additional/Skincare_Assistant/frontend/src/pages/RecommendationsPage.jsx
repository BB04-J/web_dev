import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/recommendations');
        setRecommendations(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Personalized <span className="text-gradient">Recommendations</span></h2>
      
      {error ? (
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>{error}</p>
          <Link to="/profile" className="btn-primary" style={{ display: 'inline-block' }}>Complete Profile First</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {recommendations.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No recommendations found.</p>
          ) : (
            recommendations.map((rec, index) => (
              <div key={index} className="glass-card" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '40px', height: '40px', background: 'var(--color-secondary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  {rec.step}
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{rec.name}</h3>
                <span style={{ display: 'inline-block', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '50px', background: 'var(--color-primary-light)', color: 'white', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'capitalize' }}>
                  {rec.category}
                </span>
                
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Key Ingredients:</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {rec.ingredients.map((ing, i) => (
                      <span key={i} style={{ background: 'rgba(140, 82, 255, 0.1)', color: 'var(--color-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Benefits:</h4>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    {rec.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
