import React, { useState, useEffect } from 'react';
import api from '../services/api';

const productDatabase = {
  'cerave foaming cleanser': { ingredients: ['Niacinamide', 'Ceramides', 'Hyaluronic Acid'], suitableFor: ['oily', 'combination', 'normal'] },
  'cerave hydrating cleanser': { ingredients: ['Ceramides', 'Hyaluronic Acid'], suitableFor: ['dry', 'sensitive', 'normal'] },
  'the ordinary peeling solution': { ingredients: ['AHA', 'BHA', 'Salicylic Acid', 'Glycolic Acid'], suitableFor: ['oily', 'combination', 'acne-prone'], warnings: ['Do not use on sensitive skin.', 'Do not mix with Retinol.'] },
  'paulas choice bha': { ingredients: ['Salicylic Acid', 'Green Tea Extract'], suitableFor: ['oily', 'acne-prone', 'combination'] },
  'the ordinary niacinamide': { ingredients: ['Niacinamide', 'Zinc'], suitableFor: ['oily', 'acne-prone', 'normal'] },
  'corsx snail mucin': { ingredients: ['Snail Secretion Filtrate'], suitableFor: ['dry', 'sensitive', 'normal', 'combination'] }
};

const SuitabilityCheckerPage = () => {
  const [profile, setProfile] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data.data) {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!profile) return alert('Please complete your skin profile first.');

    const searchKey = query.toLowerCase().trim();
    
    // Find closest match
    const matchKey = Object.keys(productDatabase).find(k => k.includes(searchKey) || searchKey.includes(k));
    
    if (matchKey) {
      const product = productDatabase[matchKey];
      const isSuitable = product.suitableFor.includes(profile.skinType) || profile.skinType === 'normal';
      
      setResult({
        name: matchKey.replace(/\b\w/g, l => l.toUpperCase()),
        ingredients: product.ingredients,
        isSuitable,
        warnings: product.warnings || []
      });
    } else {
      setResult(null);
    }
    setHasSearched(true);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        Product Suitability <span className="text-gradient">Checker</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Check if a specific product matches your saved skin profile ({profile?.skinType || 'unknown'} skin).
      </p>

      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="e.g., CeraVe Foaming Cleanser, The Ordinary AHA BHA..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', flex: 1, outline: 'none' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', border: 'none' }}>
            Analyze
          </button>
        </form>
      </div>

      {hasSearched && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {result ? (
            <div className="glass-card animate-fade-in" style={{ borderTop: `6px solid ${result.isSuitable ? 'var(--color-success)' : 'var(--color-error)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{result.name}</h3>
                <span style={{ 
                  background: result.isSuitable ? 'var(--color-success)' : 'var(--color-error)', 
                  color: 'white', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: 'bold' 
                }}>
                  {result.isSuitable ? '✅ Excellent Match' : '⚠️ Not Recommended'}
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Key Ingredients Detected:</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {result.ingredients.map((ing, i) => (
                    <span key={i} style={{ background: 'rgba(140,82,255,0.1)', color: 'var(--color-secondary)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {!result.isSuitable && (
                <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--color-error)' }}>
                  <p style={{ margin: 0, color: 'var(--color-error)' }}>This product is formulated for {result.ingredients.suitableFor?.join(', ')} skin, which conflicts with your {profile.skinType} skin type.</p>
                </div>
              )}

              {result.warnings.length > 0 && (
                <div style={{ marginTop: '1rem', background: 'rgba(241, 196, 15, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--color-warning)' }}>
                  <h4 style={{ color: 'var(--color-warning)', margin: 0 }}>Critical Warnings:</h4>
                  <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: '#b8960b' }}>
                    {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card animate-fade-in" style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--color-error)' }}>Product Not in Database</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                We couldn't find this exact product. Try searching for broader terms or check the main ingredients in the Ingredient Checker instead.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuitabilityCheckerPage;
