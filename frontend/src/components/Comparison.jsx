export default function Comparison({ scraped, optimized }) {
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px', 
      marginBottom: '30px',
      width: '100%'
    }}>
      <div style={{ 
        border: '2px solid #e8e8e8', 
        padding: '30px', 
        borderRadius: '15px',
        backgroundColor: 'white',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        height: 'fit-content'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '2px solid #dc3545'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#dc3545',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            O
          </div>
          <h3 style={{ 
            color: '#dc3545', 
            margin: 0,
            fontSize: '1.5rem'
          }}>
            Original Listing
          </h3>
        </div>
        
        <h4 style={{ 
          margin: '20px 0 15px 0', 
          color: '#232f3e',
          fontSize: '1.3rem',
          lineHeight: '1.4'
        }}>
          {scraped?.title}
        </h4>
        
        <ul style={{ 
          paddingLeft: '20px', 
          marginBottom: '25px',
          listStyle: 'none'
        }}>
          {(scraped?.bullets || []).map((b, i) => (
            <li key={i} style={{ 
              marginBottom: '12px', 
              lineHeight: '1.5',
              paddingLeft: '15px',
              position: 'relative',
              color: '#555'
            }}>
              <span style={{
                position: 'absolute',
                left: 0,
                color: '#dc3545',
                fontWeight: 'bold'
              }}>•</span>
              {b}
            </li>
          ))}
        </ul>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          borderLeft: '4px solid #dc3545'
        }}>
          <p style={{ 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.6', 
            color: '#666',
            margin: 0
          }}>
            {scraped?.description}
          </p>
        </div>
      </div>
      
      {/* Optimized Column */}
      <div style={{ 
        border: '2px solid #28a745', 
        padding: '30px', 
        borderRadius: '15px', 
        backgroundColor: '#f8fff9',
        boxShadow: '0 5px 20px rgba(40, 167, 69, 0.15)',
        height: 'fit-content',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '20px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          AI OPTIMIZED
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '2px solid #28a745'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#28a745',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            ✨
          </div>
          <h3 style={{ 
            color: '#28a745', 
            margin: 0,
            fontSize: '1.5rem'
          }}>
            Optimized Listing
          </h3>
        </div>
        
        <h4 style={{ 
          margin: '20px 0 15px 0', 
          color: '#232f3e',
          fontSize: '1.3rem',
          lineHeight: '1.4'
        }}>
          {optimized?.title}
        </h4>
        
        <ul style={{ 
          paddingLeft: '20px', 
          marginBottom: '25px',
          listStyle: 'none'
        }}>
          {(optimized?.bullets || []).map((b, i) => (
            <li key={i} style={{ 
              marginBottom: '12px', 
              lineHeight: '1.5',
              paddingLeft: '15px',
              position: 'relative',
              color: '#555'
            }}>
              <span style={{
                position: 'absolute',
                left: 0,
                color: '#28a745',
                fontWeight: 'bold'
              }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          borderLeft: '4px solid #28a745',
          marginBottom: '20px'
        }}>
          <p style={{ 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.6', 
            color: '#666',
            margin: 0
          }}>
            {optimized?.description}
          </p>
        </div>

        {/* Keywords Section */}
        <div style={{ 
          marginTop: '25px', 
          padding: '20px',
          backgroundColor: '#e7f3ff',
          borderRadius: '10px',
          border: '2px dashed #007bff'
        }}>
          <h5 style={{ 
            color: '#007bff', 
            marginBottom: '15px',
            fontSize: '1.1rem'
          }}>
            🎯 Suggested Keywords
          </h5>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {(optimized?.keywords || []).map((keyword, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}