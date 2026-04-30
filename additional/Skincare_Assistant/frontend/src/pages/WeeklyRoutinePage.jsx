import React, { useState, useEffect } from 'react';
import api from '../services/api';

const WeeklyRoutinePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.data) {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getWeeklySuggestions = () => {
    if (!profile) return [];

    const suggestions = [];

    // Base suggestions depending on skin type
    if (profile.skinType === 'oily' || profile.skinType === 'acne-prone') {
      suggestions.push({
        title: 'Chemical Exfoliation (BHA)',
        frequency: '2-3x per week',
        days: 'Monday, Thursday',
        reason: 'Unclogs pores and controls sebum production.',
        icon: '🧪'
      });
      suggestions.push({
        title: 'Clay Mask',
        frequency: '1x per week',
        days: 'Sunday',
        reason: 'Deep cleanses and absorbs excess oil.',
        icon: '🏺'
      });
    } else if (profile.skinType === 'dry' || profile.skinType === 'sensitive') {
      suggestions.push({
        title: 'Gentle Lactic Acid (AHA)',
        frequency: '1x per week',
        days: 'Wednesday',
        reason: 'Gently sloughs off dead skin cells without stripping moisture.',
        icon: '💧'
      });
      suggestions.push({
        title: 'Hydrating Sheet Mask',
        frequency: '2x per week',
        days: 'Tuesday, Friday',
        reason: 'Provides a massive boost of deep hydration.',
        icon: '🧖‍♀️'
      });
    } else {
      // Normal / Combination
      suggestions.push({
        title: 'AHA/BHA Exfoliant',
        frequency: '2x per week',
        days: 'Tuesday, Friday',
        reason: 'Maintains skin texture and prevents dullness.',
        icon: '✨'
      });
      suggestions.push({
        title: 'Soothing/Hydrating Mask',
        frequency: '1x per week',
        days: 'Sunday',
        reason: 'Resets the skin barrier for the week ahead.',
        icon: '🌿'
      });
    }

    // Universal suggestions
    suggestions.push({
      title: 'Wash Makeup Brushes',
      frequency: '1x per week',
      days: 'Sunday',
      reason: 'Prevents bacteria buildup that causes breakouts.',
      icon: '🖌️'
    });

    return suggestions;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading Weekly Planner...</div>;

  const suggestions = getWeeklySuggestions();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Weekly <span className="text-gradient">Planner</span></h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
        In addition to your daily routine, here are the weekly treatments suggested for your {profile?.skinType || 'specific'} skin.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        {suggestions.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <p>Please complete your Skin Profile first to generate a weekly plan.</p>
          </div>
        ) : (
          suggestions.map((item, index) => (
            <div key={index} className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ fontSize: '3rem' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{item.title}</h3>
                  <span style={{ background: 'var(--color-secondary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {item.frequency}
                  </span>
                </div>
                <p style={{ color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Suggested Days: {item.days}
                </p>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  {item.reason}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WeeklyRoutinePage;
