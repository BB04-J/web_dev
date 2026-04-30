import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RoutinePage = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoutine, setNewRoutine] = useState({ name: '', time: 'morning', category: 'skincare' });
  const [filter, setFilter] = useState('all'); // all, morning, night, completed
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

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

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newRoutine.name.trim()) return;
    try {
      await api.post('/routines', newRoutine);
      setNewRoutine({ name: '', time: 'morning', category: 'skincare' });
      fetchRoutines();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      // Optimistic update
      setRoutines(routines.map(r => r._id === id ? { ...r, completed: !r.completed } : r));
      await api.patch(`/routines/${id}/complete`);
      // No need to fetch immediately if optimistic update works, but we can to be safe
      fetchRoutines();
    } catch (err) {
      console.error(err);
      fetchRoutines(); // revert on fail
    }
  };

  const deleteRoutine = async (id) => {
    try {
      setRoutines(routines.filter(r => r._id !== id));
      await api.delete(`/routines/${id}`);
    } catch (err) {
      console.error(err);
      fetchRoutines();
    }
  };

  const startEditing = (routine) => {
    setEditingId(routine._id);
    setEditName(routine.name);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      setRoutines(routines.map(r => r._id === id ? { ...r, name: editName } : r));
      setEditingId(null);
      await api.put(`/routines/${id}`, { name: editName });
    } catch (err) {
      console.error(err);
      fetchRoutines();
    }
  };

  // Derived state for Progress Tracker
  const totalSteps = routines.length;
  const completedSteps = routines.filter(r => r.completed).length;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Filtered Routines
  const filteredRoutines = routines.filter(r => {
    if (filter === 'morning') return r.time === 'morning';
    if (filter === 'night') return r.time === 'night';
    if (filter === 'completed') return r.completed;
    return true; // 'all'
  });

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Progress Tracker */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Daily Routine Progress</h3>
          <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{completedSteps} / {totalSteps} steps completed</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: '#e0e0e0', borderRadius: '50px', overflow: 'hidden', marginTop: '0.5rem' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>

      {/* Add New Step */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add Routine Step</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Product name (e.g. Cleanser)" 
            value={newRoutine.name}
            onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})}
            required
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', flex: 1, minWidth: '200px' }}
          />
          <select 
            value={newRoutine.time}
            onChange={(e) => setNewRoutine({...newRoutine, time: e.target.value})}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            <option value="morning">Morning 🌞</option>
            <option value="night">Night 🌙</option>
          </select>
          <select 
            value={newRoutine.category}
            onChange={(e) => setNewRoutine({...newRoutine, category: e.target.value})}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
          >
            <option value="skincare">Skincare</option>
            <option value="makeup">Makeup</option>
            <option value="haircare">Haircare</option>
          </select>
          <button type="submit" className="btn-primary" style={{ padding: '0.8rem 1.5rem', border: 'none' }}>Add Step</button>
        </form>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'morning', 'night', 'completed'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              border: `1px solid ${filter === f ? 'var(--color-primary)' : '#ccc'}`,
              background: filter === f ? 'var(--color-primary)' : 'transparent',
              color: filter === f ? 'white' : 'var(--color-text-main)',
              textTransform: 'capitalize',
              fontWeight: '500'
            }}
          >
            {f === 'morning' ? 'Morning 🌞' : f === 'night' ? 'Night 🌙' : f}
          </button>
        ))}
      </div>

      {/* Routine List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredRoutines.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>No routines match this filter. Start adding some!</p>
        ) : (
          filteredRoutines.map(routine => (
            <div key={routine._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `4px solid ${routine.time === 'morning' ? '#f1c40f' : '#34495e'}` }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {editingId === routine._id ? (
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => saveEdit(routine._id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(routine._id)}
                    autoFocus
                    style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-primary)', flex: 1, marginRight: '1rem' }}
                  />
                ) : (
                  <h3 
                    onClick={() => startEditing(routine)}
                    title="Click to edit"
                    style={{ 
                      cursor: 'pointer',
                      textDecoration: routine.completed ? 'line-through' : 'none', 
                      color: routine.completed ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                      margin: 0
                    }}
                  >
                    {routine.name} ✎
                  </h3>
                )}
                <span style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', borderRadius: '50px', background: routine.time === 'morning' ? '#fff9c4' : '#cfd8dc', color: '#333', fontWeight: 'bold' }}>
                  {routine.time === 'morning' ? '🌞 Morning' : '🌙 Night'}
                </span>
              </div>
              
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0, textTransform: 'capitalize' }}>{routine.category}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem' }}>
                <button 
                  onClick={() => toggleComplete(routine._id)}
                  style={{ 
                    background: routine.completed ? 'var(--color-success)' : 'transparent', 
                    color: routine.completed ? 'white' : 'var(--color-success)', 
                    border: '1px solid var(--color-success)', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '8px', 
                    transition: 'all 0.3s',
                    fontWeight: '600'
                  }}
                >
                  {routine.completed ? '✓ Completed' : 'Mark Done'}
                </button>
                <button 
                  onClick={() => deleteRoutine(routine._id)}
                  style={{ background: 'transparent', color: 'var(--color-error)', border: 'none', padding: '0.4rem', borderRadius: '8px', textDecoration: 'underline' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoutinePage;
