import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DashboardPage = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await api.get('/routines');
        setRoutines(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const totalRoutines = routines.length;
  const completedRoutines = routines.filter(r => r.completed).length;
  const completionPercent = totalRoutines === 0 ? 0 : Math.round((completedRoutines / totalRoutines) * 100);

  // Mocking past 6 days data for a portfolio project, and using real data for "Today"
  const weeklyData = [
    { day: 'Mon', percent: 80 },
    { day: 'Tue', percent: 60 },
    { day: 'Wed', percent: 100 },
    { day: 'Thu', percent: 40 },
    { day: 'Fri', percent: 90 },
    { day: 'Sat', percent: 70 },
    { day: 'Today', percent: completionPercent }
  ];

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading Dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Dashboard <span className="text-gradient">Overview</span></h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Total Routines Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Total Steps</h3>
          <span style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{totalRoutines}</span>
        </div>

        {/* Completion Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Daily Completion</h3>
          <span style={{ fontSize: '4rem', fontWeight: 'bold', color: completionPercent === 100 ? 'var(--color-success)' : 'var(--color-secondary)' }}>
            {completionPercent}%
          </span>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '2rem' }}>Weekly Consistency</h3>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '250px', paddingTop: '20px', gap: '10px' }}>
          {weeklyData.map((data, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              {/* Tooltip text */}
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{data.percent}%</span>
              
              {/* Bar */}
              <div style={{ 
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'flex-end',
                background: 'rgba(200,200,200,0.1)',
                borderRadius: '8px 8px 0 0',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '100%', 
                  height: `${data.percent}%`, 
                  background: data.day === 'Today' ? 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))' : 'var(--color-primary-light)',
                  transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '8px 8px 0 0'
                }}></div>
              </div>
              
              {/* Day Label */}
              <span style={{ marginTop: '1rem', fontWeight: data.day === 'Today' ? 'bold' : 'normal', color: data.day === 'Today' ? 'var(--color-primary)' : 'var(--color-text-main)' }}>
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
