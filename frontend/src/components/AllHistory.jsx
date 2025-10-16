import { useEffect, useState } from 'react';
import { fetchAll } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AllHistory() {
  const [optimizations, setOptimizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchAll();
        setOptimizations(response.data);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const viewDetails = (asin) => {
    navigate(`/?asin=${asin}`);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '18px',
        color: '#666',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <p>Loading optimization history...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, #232f3e 0%, #FF9900 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          marginBottom: '15px'
        }}>
          Optimization History
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          View all your optimized Amazon product listings in one place
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 20px' }}>
        {optimizations.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
            <h3 style={{ color: '#232f3e', marginBottom: '15px' }}>No Optimizations Yet</h3>
            <p style={{ color: '#666', marginBottom: '25px' }}>
              You haven't optimized any products yet. Go to the Product Optimizer to get started!
            </p>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '12px 30px',
                backgroundColor: '#FF9900',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🚀 Start Optimizing
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
          }}>
            {optimizations.map(opt => (
              <div 
                key={opt.id} 
                style={{ 
                  border: '1px solid #e8e8e8', 
                  borderRadius: '15px', 
                  padding: '25px',
                  backgroundColor: 'white',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => viewDetails(opt.asin)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#232f3e',
                      fontSize: '18px',
                      lineHeight: '1.4',
                      fontWeight: '600'
                    }}>
                      {opt.optimized_title || 'No title available'}
                    </h4>
                    <p style={{ 
                      margin: '0 0 10px 0', 
                      color: '#666', 
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      ASIN: <span style={{ color: '#FF9900' }}>{opt.asin}</span>
                    </p>
                    <p style={{ 
                      margin: '0', 
                      color: '#888', 
                      fontSize: '13px'
                    }}>
                      {new Date(opt.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ marginLeft: '15px' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDetails(opt.asin);
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#FF9900',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                {opt.keywords && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '15px',
                    backgroundColor: '#e7f3ff',
                    borderRadius: '8px',
                    borderLeft: '4px solid #007bff'
                  }}>
                    <strong style={{ fontSize: '14px', color: '#007bff' }}>Keywords: </strong>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#555'
                    }}>
                      {(() => {
                        try {
                          if (!opt.keywords) return 'No keywords';
                          
                          if (typeof opt.keywords === 'string') {
                            const parsed = JSON.parse(opt.keywords);
                            return Array.isArray(parsed) ? parsed.join(', ') : 'Invalid keywords format';
                          } else if (Array.isArray(opt.keywords)) {
                            return opt.keywords.join(', ');
                          } else {
                            return 'No keywords available';
                          }
                        } catch (error) {
                          console.error('Error parsing keywords:', error);
                          return 'Error loading keywords';
                        }
                      })()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}