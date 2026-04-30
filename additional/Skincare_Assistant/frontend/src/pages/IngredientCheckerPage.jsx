import React, { useState } from 'react';

// Static knowledge base for zero-cost implementation
const ingredientDatabase = {
  'niacinamide': {
    name: 'Niacinamide (Vitamin B3)',
    benefits: ['Reduces inflammation', 'Minimizes pore appearance', 'Regulates oil', 'Protects against sun damage'],
    targets: ['acne', 'open-pores', 'pigmentation'],
    suitability: 'Great for all skin types, especially oily and acne-prone skin.'
  },
  'salicylic acid': {
    name: 'Salicylic Acid (BHA)',
    benefits: ['Exfoliates inside pores', 'Reduces breakouts', 'Anti-inflammatory'],
    targets: ['acne', 'open-pores'],
    suitability: 'Best for oily and acne-prone skin. May dry out sensitive or dry skin.'
  },
  'hyaluronic acid': {
    name: 'Hyaluronic Acid',
    benefits: ['Deep hydration', 'Plumps the skin', 'Reduces fine lines'],
    targets: ['dry-patches', 'dull-skin'],
    suitability: 'Perfect for all skin types, especially dry and dehydrated skin.'
  },
  'retinol': {
    name: 'Retinol (Vitamin A)',
    benefits: ['Increases cell turnover', 'Stimulates collagen', 'Fades dark spots'],
    targets: ['pigmentation', 'dull-skin', 'acne'],
    suitability: 'Use with caution on sensitive skin. Start slow (1-2x a week) and always use sunscreen.'
  },
  'vitamin c': {
    name: 'Vitamin C (Ascorbic Acid)',
    benefits: ['Brightens complexion', 'Fades hyperpigmentation', 'Potent antioxidant'],
    targets: ['pigmentation', 'dull-skin', 'tanning', 'uneven-tone'],
    suitability: 'Good for most skin types. Can be irritating for highly sensitive skin in high concentrations.'
  },
  'ceramides': {
    name: 'Ceramides',
    benefits: ['Restores skin barrier', 'Locks in moisture', 'Protects against environmental damage'],
    targets: ['dry-patches', 'sensitive-skin'],
    suitability: 'Excellent for all skin types, particularly dry, compromised, or sensitive skin.'
  }
};

const IngredientCheckerPage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchKey = query.toLowerCase().trim();
    if (ingredientDatabase[searchKey]) {
      setResult(ingredientDatabase[searchKey]);
    } else {
      setResult(null);
    }
    setHasSearched(true);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        Ingredient <span className="text-gradient">Checker</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Search for an ingredient to see its benefits and skin suitability.
      </p>
      
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="e.g., Niacinamide, Retinol, Vitamin C..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', flex: 1, outline: 'none' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', border: 'none' }}>
            Check
          </button>
        </form>
      </div>

      {hasSearched && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {result ? (
            <div className="glass-card animate-fade-in">
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>{result.name}</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>✨ Key Benefits:</h4>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
                  {result.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>🎯 Best For Concerns:</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {result.targets.map((target, i) => (
                    <span key={i} style={{ background: 'var(--color-primary-light)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                      {target.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--color-success)' }}>
                <h4 style={{ color: 'var(--color-success)', marginBottom: '0.2rem' }}>Skin Suitability</h4>
                <p style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>{result.suitability}</p>
              </div>
            </div>
          ) : (
            <div className="glass-card animate-fade-in" style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--color-error)' }}>Ingredient Not Found</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                Try searching for common active ingredients like Niacinamide, Salicylic Acid, Vitamin C, or Ceramides.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientCheckerPage;
