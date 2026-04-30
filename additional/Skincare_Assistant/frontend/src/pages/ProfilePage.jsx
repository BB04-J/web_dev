import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    skinType: 'normal',
    concerns: [],
    level: 'beginner'
  });

  const skinTypes = ['oily', 'dry', 'combination', 'sensitive', 'acne-prone', 'normal'];
  const allConcerns = ['acne', 'pigmentation', 'dull-skin', 'dark-circles', 'open-pores', 'dry-patches', 'tanning', 'uneven-tone'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.data) {
          setProfile(res.data.data);
          setFormData({
            skinType: res.data.data.skinType || 'normal',
            concerns: res.data.data.concerns || [],
            level: res.data.data.level || 'beginner'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleConcernToggle = (concern) => {
    setFormData(prev => {
      if (prev.concerns.includes(concern)) {
        return { ...prev, concerns: prev.concerns.filter(c => c !== concern) };
      } else {
        return { ...prev, concerns: [...prev.concerns, concern] };
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', formData);
      setSuccessMsg('Profile updated successfully! Now check your recommendations.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Your <span className="text-gradient">Skin Profile</span></h2>
      
      <div className="glass-card">
        {successMsg && <div style={{ background: 'var(--color-success)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>{successMsg}</div>}
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Skin Type */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Skin Type</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {skinTypes.map(type => (
                <div 
                  key={type}
                  onClick={() => setFormData({...formData, skinType: type})}
                  style={{
                    padding: '0.8rem 1.5rem',
                    borderRadius: '50px',
                    border: `2px solid ${formData.skinType === type ? 'var(--color-primary)' : '#ddd'}`,
                    background: formData.skinType === type ? 'var(--color-primary)' : 'transparent',
                    color: formData.skinType === type ? 'white' : 'var(--color-text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Skin Concerns (Select multiple)</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {allConcerns.map(concern => (
                <div 
                  key={concern}
                  onClick={() => handleConcernToggle(concern)}
                  style={{
                    padding: '0.8rem 1.5rem',
                    borderRadius: '50px',
                    border: `2px solid ${formData.concerns.includes(concern) ? 'var(--color-secondary)' : '#ddd'}`,
                    background: formData.concerns.includes(concern) ? 'var(--color-secondary)' : 'transparent',
                    color: formData.concerns.includes(concern) ? 'white' : 'var(--color-text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize'
                  }}
                >
                  {concern.replace('-', ' ')}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '1rem', border: 'none', fontSize: '1.1rem', marginTop: '1rem' }}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
