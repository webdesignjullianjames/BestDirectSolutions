export default function GetStarted() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* Hero Background Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}></div>
        {/* Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '40px'
        }}>
          <div style={{
            fontSize: '14px',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C8A020',
            marginBottom: '24px'
          }}>
            Ready to Scale
          </div>

          <h1 style={{
            fontFamily: "'The Seasons', serif",
            // Upper bound is the original 64px, so desktop is unchanged — 5.5vw
            // only wins below ~1164px, where 64px would otherwise overflow.
            fontSize: 'clamp(2rem, 5.5vw, 64px)',
            color: '#ffffff',
            margin: '0 0 24px 0',
            fontWeight: 'normal',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
          }}>
            Get <span style={{ color: '#C8A020' }}>Started</span> Today
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#E8D9B3',
            margin: '0 0 40px 0',
            lineHeight: '1.6',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            fontFamily: 'Barlow, sans-serif'
          }}>
            Join the fastest-growing flatbed logistics network. Let us handle your freight while you focus on growing your business.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#C8A020',
              color: '#0A0A0A',
              fontSize: '13px',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              textDecoration: 'none',
              cursor: 'pointer',
              border: 'none',
              borderRadius: '4px',
              transition: 'all 0.3s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dbb800'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#C8A020'}
            >
              Request a Quote
            </a>
            <a href="#steps" style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'transparent',
              color: '#E8D9B3',
              fontSize: '13px',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              textDecoration: 'none',
              cursor: 'pointer',
              border: '2px solid #E8D9B3',
              borderRadius: '4px',
              transition: 'all 0.3s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(232, 217, 179, 0.1)'
              e.target.style.borderColor = '#C8A020'
              e.target.style.color = '#C8A020'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = '#E8D9B3'
              e.target.style.color = '#E8D9B3'
            }}
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div id="steps" style={{
        padding: '80px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C8A020',
            marginBottom: '16px'
          }}>
            The Process
          </div>
          <h2 style={{
            fontFamily: "'The Seasons', serif",
            fontSize: 'clamp(1.75rem, 4.5vw, 48px)',
            color: '#F5E6B8',
            margin: '0'
          }}>
            Simple Steps to <span style={{ color: '#C8A020' }}>Success</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px'
        }}>
          {[
            { num: '01', title: 'Get in Touch', desc: 'Share your shipping requirements and volume with our team' },
            { num: '02', title: 'Custom Quote', desc: 'Receive a tailored rate quote based on your specific needs' },
            { num: '03', title: 'Onboard', desc: 'Complete documentation and get integrated into our system' },
            { num: '04', title: 'Start Shipping', desc: 'Begin moving freight with dedicated support from day one' }
          ].map((step, idx) => (
            <div key={idx} style={{
              padding: '32px',
              backgroundColor: 'rgba(200, 160, 32, 0.06)',
              border: '1px solid rgba(200, 160, 32, 0.2)',
              borderRadius: '8px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div style={{
                fontSize: 'clamp(1.9rem, 4vw, 42px)',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: '800',
                color: '#C8A020',
                marginBottom: '16px'
              }}>
                {step.num}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: '700',
                color: '#E8D9B3',
                margin: '0 0 12px 0'
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#D8D8D8',
                margin: 0,
                fontFamily: 'Barlow, sans-serif',
                lineHeight: '1.6'
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '80px 40px',
        textAlign: 'center',
        borderTop: '1px solid rgba(200, 160, 32, 0.2)'
      }}>
        <h2 style={{
          fontFamily: "'The Seasons', serif",
          fontSize: 'clamp(1.75rem, 4.5vw, 48px)',
          color: '#F5E6B8',
          margin: '0 0 24px 0'
        }}>
          Ready to Partner With <span style={{ color: '#C8A020' }}>Best Direct?</span>
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#D8D8D8',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
          fontFamily: 'Barlow, sans-serif'
        }}>
          Connect with our team today and discover how we can optimize your freight logistics.
        </p>
        <a href="/contact" style={{
          display: 'inline-block',
          padding: '14px 40px',
          backgroundColor: '#C8A020',
          color: '#0A0A0A',
          fontSize: '13px',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          textDecoration: 'none',
          cursor: 'pointer',
          border: 'none',
          borderRadius: '4px',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#dbb800'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#C8A020'}
        >
          Request a Quote →
        </a>
      </div>
    </div>
  )
}
