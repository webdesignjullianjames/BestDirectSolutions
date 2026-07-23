import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  // The chosen category lives here rather than inside ContactForm: this page
  // swaps its hero image to match, and both the "Apply Now" banner and the
  // ?type=freight deep link need to set it from outside the form.
  //
  // Read from the URL in the initialiser so a deep link is already applied on
  // the first render — as an effect it would flash the default hero first, and
  // this repo's lint rules reject setState inside an effect body.
  const [helpWith, setHelpWith] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('type') === 'freight' ? 'freight' : ''
  })
  const location = useLocation()

  const isDriverApp = helpWith === 'driveWithUs'
  const isFreightQuote = helpWith === 'freight'

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location])

  return (
    <div className="contact-shell" style={{
      width: '100%',
      minHeight: '100vh',
      // Both ends, not just the top. minHeight lets the shell grow once a
      // category is chosen and the card outgrows the viewport — and at that
      // point there is no slack left for align-items: center to distribute, so
      // the card's base lands flush on the footer. The bottom padding is the
      // only thing holding the two apart in that state. At rest it simply
      // centres the card evenly instead of 30px low.
      paddingTop: '60px',
      paddingBottom: '60px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Full-background hero video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/Company Images/territory-background.jpg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src="/Company Images/contact-page-loop.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(13, 15, 18, 0.35)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>

      {/* Floating frosted-glass card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '560px',
        width: '90%',
        backgroundColor: 'rgba(13, 15, 18, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(200, 160, 32, 0.3)',
        borderTop: '3px solid #C8A020',
        borderRadius: '8px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        padding: '0',
        margin: '0 auto',
        overflow: 'hidden'
      }}>

        {/* Driver Banner */}
        <div style={{
          backgroundColor: 'rgba(200, 160, 32, 0.15)',
          borderBottom: '2px solid #C8A020',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontFamily: "'The Seasons', serif",
              fontWeight: '800',
              color: '#C8A020',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              display: 'flex',
              alignItems: 'center',
              gap: '7px'
            }}>
              {/* Replaces a 🚛 emoji, which rendered in whatever font the OS
                  supplied and so looked different on every platform. Decorative
                  only — the text beside it carries the meaning. */}
              <img
                src="/Company Images/page-icons/truck-icon.svg"
                alt=""
                aria-hidden="true"
                style={{
                  width: '22px',
                  height: 'auto',
                  flexShrink: 0,
                  display: 'block'
                }}
              />
              Now Hiring Drivers
            </p>
            <p style={{
              margin: '4px 0 0',
              fontSize: '12px',
              fontFamily: "'The Seasons', serif",
              color: '#E8E8E8',
              fontWeight: '500',
              letterSpacing: '0.2px',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased'
            }}>
              Join our veteran-owned fleet
            </p>
          </div>
          <button
            onClick={() => setHelpWith('driveWithUs')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#C8A020',
              color: '#0D0F12',
              border: 'none',
              borderRadius: '3px',
              fontSize: '11px',
              fontFamily: "'The Seasons', serif",
              fontWeight: '800',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              marginLeft: '16px',
              letterSpacing: '0.5px',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#D4B96A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#C8A020'}
          >
            Apply Now
          </button>
        </div>

        {/* Main content */}
        <div style={{ padding: '32px 30px' }}>
        <style>{`
          /* The gap that keeps the card off the footer is the shell's own
             padding-bottom, set inline so it applies at every width — a rule
             here could not do that job anyway, since an inline style outranks
             it. What is left for the phone case is the anchoring: a card taller
             than the viewport gets clipped at the TOP when it is centred,
             because the overflow splits both ways and there is no scrolling up
             past a flex container's start edge. Anchoring to the top puts the
             whole overflow below, where it can be scrolled to. */
          @media (max-width: 900px) {
            .contact-shell {
              align-items: flex-start;
            }
          }
          @keyframes borderShimmer {
            0%, 100% { box-shadow: 0 0 6px rgba(200, 160, 32, 0.1), 0 8px 20px rgba(0, 0, 0, 0.4); }
            50% { box-shadow: 0 0 10px rgba(200, 160, 32, 0.2), 0 8px 20px rgba(0, 0, 0, 0.4); }
          }
          @keyframes inputShimmer {
            0%, 100% { box-shadow: inset 0 0 4px rgba(200, 160, 32, 0.08), 0 0 4px rgba(200, 160, 32, 0.1); }
            50% { box-shadow: inset 0 0 8px rgba(200, 160, 32, 0.12), 0 0 8px rgba(200, 160, 32, 0.15); }
          }
          @keyframes heroFadeScale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .hero-image {
            animation: heroFadeScale 0.6s ease-out forwards, borderShimmer 3s ease-in-out infinite 0.6s;
          }
          input, select, textarea {
            animation: inputShimmer 3s ease-in-out infinite !important;
          }
        `}</style>

        {/* Card Header - Driver App Hero Image */}
        {isDriverApp && (
          <img
            key="driver-app"
            className="hero-image"
            src="/Company Images/contact-hero-driver.png"
            alt="Now Hiring Drivers"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              marginBottom: '20px',
              borderRadius: '8px 8px 0 0',
              objectFit: 'cover',
              border: '1px solid #C8A020'
            }}
          />
        )}

        {/* Card Header - Freight Quote Hero Image */}
        {isFreightQuote && (
          <img
            key="freight-quote"
            className="hero-image"
            src="/Company Images/contact-hero-freight.png"
            alt="Freight Quote"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              marginBottom: '20px',
              borderRadius: '8px 8px 0 0',
              objectFit: 'cover',
              border: '1px solid #C8A020'
            }}
          />
        )}

        {/* Card Header - Dispatcher Hero Image */}
        {!isDriverApp && !isFreightQuote && (
          <img
            key="dispatcher"
            className="hero-image"
            src="/Company Images/contact-hero-general.png"
            alt="Contact Us - Best Direct Solutions Dispatcher"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              marginBottom: '20px',
              borderRadius: '8px 8px 0 0',
              objectFit: 'cover',
              border: '1px solid #C8A020'
            }}
          />
        )}

        {/* Form with updated styling for card */}
        <div style={{
          padding: '0'
        }}>
          <ContactFormCardVersion
            helpWith={helpWith}
            onHelpWithChange={setHelpWith}
          />
        </div>

          {/* Footer line */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(200, 160, 32, 0.2)',
            textAlign: 'center',
            fontSize: '11px',
            color: '#888888',
            fontFamily: "'The Seasons', serif",
            letterSpacing: '0.5px',
            fontWeight: '500',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased'
          }}>
            We respond within 24 hours · No hassle · No runaround
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom form wrapper with card-optimized styling
function ContactFormCardVersion({ helpWith, onHelpWithChange }) {
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(26, 31, 38, 0.8)',
    border: '1.5px solid rgba(200, 160, 32, 0.2)',
    color: '#E8E8E8',
    borderRadius: '3px',
    fontSize: '13px',
    fontFamily: "'The Seasons', serif",
    transition: 'all 0.2s',
    fontWeight: '400',
    letterSpacing: '0.15px',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontFamily: "'The Seasons', serif",
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased'
  }

  const requiredStyle = {
    color: '#FF6B6B',
    marginLeft: '4px'
  }

  return (
    <ContactForm
      inputStyle={inputStyle}
      labelStyle={labelStyle}
      requiredStyle={requiredStyle}
      helpWith={helpWith}
      onHelpWithChange={onHelpWithChange}
    />
  )
}
