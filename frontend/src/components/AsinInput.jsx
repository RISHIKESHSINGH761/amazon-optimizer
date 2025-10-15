import { useState, useEffect } from 'react';
import { optimizeAsin } from '../services/api';

export default function AsinInput({ onResult, initialAsin }) {
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (initialAsin) {
      setAsin(initialAsin);
      handleSubmitProgrammatically(initialAsin);
    }
  }, [initialAsin]);

  const handleSubmitProgrammatically = async (asinValue) => {
    setErr(null);
    setLoading(true);
    try {
      const { data } = await optimizeAsin(asinValue.trim());
      onResult(data);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally { 
      setLoading(false); 
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!asin) return setErr('Please enter an ASIN');
    setLoading(true);
    try {
      const { data } = await optimizeAsin(asin.trim());
      onResult(data);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#232f3e', 
            marginBottom: '15px',
            fontSize: '1.8rem'
          }}>
            Start Optimizing Your Listings
          </h2>
          <p style={{ 
            color: '#666', 
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto 25px',
            lineHeight: '1.6'
          }}>
            Enter any Amazon ASIN to see how AI can transform your product listing
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
<div style={{ flex: '1', minWidth: '300px', maxWidth: 'none' }}>
            <input 
              value={asin} 
              onChange={e => setAsin(e.target.value)} 
              placeholder="Enter Amazon ASIN (e.g., B08N5WRWNW)" 
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                width: '100%',
                border: '2px solid #e8e8e8',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF9900';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 153, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e8e8e8';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '15px 30px', 
              fontSize: '16px', 
              backgroundColor: loading ? '#ccc' : '#FF9900',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              minWidth: '150px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 153, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 153, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 153, 0, 0.3)';
              }
            }}
          >
            {loading ? (
              <span>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                {' Optimizing...'}
              </span>
            ) : (
              <span>🚀 Optimize Now</span>
            )}
          </button>
        </div>
        
        {err && (
          <div style={{ 
            color: '#dc3545', 
            marginTop: '15px', 
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            border: '1px solid #f5c6cb'
          }}>
            {err}
          </div>
        )}

        {/* ASIN Examples */}
        <div style={{ 
          marginTop: '25px', 
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>Try these ASINs: <strong>B08N5WRWNW</strong> (Echo Dot) • <strong>B07FDJMC9Y</strong> (Instant Pot) • <strong>B09FMH86Z9</strong> (Air Fryer)</p>
        </div>
      </form>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}