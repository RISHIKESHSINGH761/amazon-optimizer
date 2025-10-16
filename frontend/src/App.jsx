import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AsinInput from './components/AsinInput';
import Comparison from './components/Comparison';
import AllHistory from './components/AllHistory';
import './index.css';

function OptimizerView() {
  const [result, setResult] = useState(null);
  const location = useLocation();
  
  const urlParams = new URLSearchParams(location.search);
  const initialAsin = urlParams.get('asin');

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    }}>
      {!result && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#FF9900',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '20px'
            }}>
              A
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              background: 'linear-gradient(135deg, #232f3e 0%, #FF9900 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              Amazon Listing Optimizer
            </h1>
          </div>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            margin: '0 auto 30px',
            lineHeight: '1.6'
          }}>
            Transform your Amazon product listings with AI-powered optimization. 
            Get better titles, compelling bullet points, and persuasive descriptions.
          </p>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '40px 20px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
        borderTop: '1px solid #e8e8e8',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <AsinInput onResult={(d) => setResult(d)} initialAsin={initialAsin} />
      </div>

      {result && (
        <div style={{ padding: '40px 20px' }}>
          {result?.scraped?.title?.includes('Unable to scrape') && (
            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '30px',
              color: '#856404',
              textAlign: 'center',
              fontSize: '16px'
            }}>
              ⚠️ <strong>Demo Mode:</strong> Showing sample product data. Real Amazon scraping requires additional configuration.
            </div>
          )}
          
          <Comparison scraped={result.scraped} optimized={result.optimized} />
        </div>
      )}

      {!result && (
        <div style={{
          padding: '60px 20px',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '40px',
            color: '#232f3e',
            fontSize: '2rem'
          }}>
            Why Use Our Optimizer?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
          }}>
            {[
              {
                icon: '🚀',
                title: 'AI-Powered Optimization',
                description: 'Leverage advanced AI to create compelling product listings that convert.'
              },
              {
                icon: '📈',
                title: 'Increase Visibility',
                description: 'Get keyword-rich titles and descriptions that rank higher in search results.'
              },
              {
                icon: '💡',
                title: 'Save Time',
                description: 'Automate your listing optimization process and focus on growing your business.'
              },
              {
                icon: '📊',
                title: 'Track Performance',
                description: 'Monitor optimization history and track improvements over time.'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '15px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  color: '#232f3e',
                  marginBottom: '15px',
                  fontSize: '1.3rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  
  return (
    <nav style={{ 
      backgroundColor: '#232f3e',
      padding: '0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '15px 20px',
          marginRight: '40px'
        }}>
          <div style={{
            width: '35px',
            height: '35px',
            backgroundColor: '#FF9900',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'white',
            fontSize: '16px'
          }}>
            A
          </div>
          <span style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            Optimizer
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0' }}>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none',
              color: location.pathname === '/' ? '#FF9900' : '#ffffff',
              fontWeight: '600',
              padding: '20px 30px',
              borderBottom: location.pathname === '/' ? '3px solid #FF9900' : '3px solid transparent',
              backgroundColor: location.pathname === '/' ? '#131a22' : 'transparent',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🚀</span>
            Product Optimizer
          </Link>
          <Link 
            to="/history" 
            style={{ 
              textDecoration: 'none',
              color: location.pathname === '/history' ? '#FF9900' : '#ffffff',
              fontWeight: '600',
              padding: '20px 30px',
              borderBottom: location.pathname === '/history' ? '3px solid #FF9900' : '3px solid transparent',
              backgroundColor: location.pathname === '/history' ? '#131a22' : 'transparent',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📊</span>
            Optimization History
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<OptimizerView />} />
          <Route path="/history" element={<AllHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;