import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RoutineGuidancePage = () => {
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

  const analyzeRoutine = (timeRoutines) => {
    const warnings = [];
    const suggestions = [];

    const names = timeRoutines.map(r => r.name.toLowerCase());
    
    // 1. Check order (Basic heuristic: Cleanser before everything, Sunscreen last in AM)
    const cleanserIndex = names.findIndex(n => n.includes('cleanse') || n.includes('wash'));
    const serumIndex = names.findIndex(n => n.includes('serum') || n.includes('acid'));
    const moisturizerIndex = names.findIndex(n => n.includes('moisturiz') || n.includes('cream') || n.includes('lotion'));
    
    if (cleanserIndex > -1 && serumIndex > -1 && cleanserIndex > serumIndex) {
      warnings.push("Your Cleanser should be used BEFORE your Serum/Actives.");
    }
    if (serumIndex > -1 && moisturizerIndex > -1 && serumIndex > moisturizerIndex) {
      warnings.push("Your Serum should be applied BEFORE your Moisturizer.");
    }

    // 2. Check AM specific
    if (timeRoutines.length > 0 && timeRoutines[0].time === 'morning') {
      const sunscreenIndex = names.findIndex(n => n.includes('sunscreen') || n.includes('spf'));
      if (sunscreenIndex === -1) {
        warnings.push("CRITICAL: You are missing Sunscreen (SPF) in your morning routine!");
      } else if (sunscreenIndex !== names.length - 1) {
        suggestions.push("Sunscreen should generally be the very LAST step of your skincare routine.");
      }
    }

    // 3. Ingredient Conflicts
    const hasRetinol = names.some(n => n.includes('retinol') || n.includes('vitamin a'));
    const hasAHA = names.some(n => n.includes('aha') || n.includes('glycolic') || n.includes('peel'));
    const hasBHA = names.some(n => n.includes('bha') || n.includes('salicylic'));
    const hasVitC = names.some(n => n.includes('vitamin c') || n.includes('ascorbic'));

    if (hasRetinol && (hasAHA || hasBHA)) {
      warnings.push("DANGER: You are mixing Retinol with AHA/BHA. This can severely damage your skin barrier. Use them on alternate nights.");
    }
    if (hasRetinol && hasVitC) {
      warnings.push("WARNING: Mixing Retinol and Vitamin C can cause irritation. Move Vitamin C to the morning, and keep Retinol at night.");
    }
    
    if (warnings.length === 0 && suggestions.length === 0) {
      suggestions.push("Your routine looks perfectly structured! Keep up the good work.");
    }

    return { warnings, suggestions };
  };

  const amRoutines = routines.filter(r => r.time === 'morning');
  const pmRoutines = routines.filter(r => r.time === 'night');
  
  const amAnalysis = analyzeRoutine(amRoutines);
  const pmAnalysis = analyzeRoutine(pmRoutines);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Analyzing Routines...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Routine <span className="text-gradient">Guidance</span></h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
        We have automatically audited your active routines for correct layering order and ingredient conflicts.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Morning Analysis */}
        <div className="glass-card" style={{ borderTop: '6px solid #f1c40f' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🌞 Morning Routine Audit
          </h3>
          
          {amRoutines.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No morning routine steps found to analyze.</p>
          ) : (
            <>
              {amAnalysis.warnings.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>⚠️ Warnings</h4>
                  <ul style={{ color: 'var(--color-error)', paddingLeft: '1.5rem' }}>
                    {amAnalysis.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>💡 Suggestions</h4>
                <ul style={{ color: 'var(--color-text-main)', paddingLeft: '1.5rem' }}>
                  {amAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Night Analysis */}
        <div className="glass-card" style={{ borderTop: '6px solid #34495e' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🌙 Night Routine Audit
          </h3>
          
          {pmRoutines.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No night routine steps found to analyze.</p>
          ) : (
            <>
              {pmAnalysis.warnings.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>⚠️ Warnings</h4>
                  <ul style={{ color: 'var(--color-error)', paddingLeft: '1.5rem' }}>
                    {pmAnalysis.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>💡 Suggestions</h4>
                <ul style={{ color: 'var(--color-text-main)', paddingLeft: '1.5rem' }}>
                  {pmAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default RoutineGuidancePage;
