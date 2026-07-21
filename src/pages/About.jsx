import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SimpleMap from '../components/SimpleMap'
import MissionStatement from '../components/MissionStatement'
import FreightSolutions from '../components/FreightSolutions'

export default function About() {
  const location = useLocation()

  useEffect(() => {
    // Scroll to element if hash is present
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } else {
      // Scroll to top if no hash
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <div>
      <style>{`
        .metallic-gold {
          background: linear-gradient(180deg, #F2D878 0%, #E4C050 35%, #C8A020 70%, #A8861A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 0 rgba(60, 44, 8, 0.9))
                  drop-shadow(0 2px 1px rgba(0, 0, 0, 0.55))
                  drop-shadow(0 6px 14px rgba(0, 0, 0, 0.65));
        }
        @keyframes eyebrowGlow {
          0%, 100% { text-shadow: 0 0 6px rgba(200, 160, 32, 0.15); }
          50% { text-shadow: 0 0 10px rgba(200, 160, 32, 0.3); }
        }
        .eyebrow-premium {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          animation: eyebrowGlow 4s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }
        .eyebrow-premium::before,
        .eyebrow-premium::after {
          content: '';
          width: 28px;
          height: 1px;
          flex-shrink: 0;
        }
        .eyebrow-premium::before {
          background: linear-gradient(90deg, transparent, #C8A020);
        }
        .eyebrow-premium::after {
          background: linear-gradient(90deg, #C8A020, transparent);
        }
        .eyebrow-premium.manual-lines::before,
        .eyebrow-premium.manual-lines::after {
          display: none;
        }
        .eyebrow-line {
          display: inline-block;
          width: 28px;
          height: 1px;
          flex-shrink: 0;
        }
      `}</style>

      {/* PAGE HEADER */}
      <section style={{ background: '#13171C', padding: '20px 24px 18px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          {/* Eyebrow */}
          <p className="eyebrow-premium" style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: '700',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C8A020',
            margin: '0 0 8px 0'
          }}>
            WHO WE ARE
          </p>

          {/* Title */}
          <h1 className="metallic-gold" style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '34px',
            fontWeight: '800',
            textTransform: 'uppercase',
            margin: '0 0 8px 0',
            letterSpacing: '0.5px'
          }}>
            BUILT ON SERVICE
          </h1>

          {/* Subline */}
          <p style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '13px',
            color: '#8A919A',
            marginTop: '8px',
            margin: '8px 0 0 0'
          }}>
            Veteran-owned. Mission-driven. Every mile.
          </p>

          {/* Gold Rule */}
          <div style={{
            width: '48px',
            height: '3px',
            backgroundColor: '#C8A020',
            margin: '12px auto 0'
          }}></div>
        </div>
      </section>

      {/* MISSION STATEMENT SECTION */}
      <MissionStatement />

      {/* OUR STANDARD SECTION */}
      <section style={{ background: '#13171C', padding: '56px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          {/* Eyebrow */}
          <p className="eyebrow-premium" style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: '700',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C8A020',
            margin: '0 0 10px 0'
          }}>
            OUR STANDARD
          </p>

          {/* Gold Rule */}
          <div style={{
            width: '40px',
            height: '2px',
            backgroundColor: '#C8A020',
            margin: '0 auto 20px'
          }}></div>

          {/* Third paragraph (moved from mission) */}
          <p style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#8A919A',
            marginBottom: '16px'
          }}>
            From pickup to delivery, we are committed to operational excellence, protecting our customers' cargo, and serving every client with the honor, professionalism, and dedication that define our military heritage.
          </p>

          {/* Intro paragraphs */}
          <p style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#8A919A',
            marginBottom: '16px'
          }}>
            Best Direct Solutions is committed to providing award-winning flatbed delivery services with uncompromising dedication to safety, reliability, and customer satisfaction.
          </p>
          <p style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#8A919A'
          }}>
            Every driver, every delivery, and every customer interaction reflects our core values of professionalism and excellence.
          </p>
        </div>
      </section>

      {/* FREIGHT SOLUTIONS SECTION */}
      <section id="freight-solutions">
        <FreightSolutions />
      </section>

      {/* SERVICE TERRITORY SECTION */}
      <section
        id="services-section"
        className="py-20 text-white border-t border-[#C9A86C] relative bg-black overflow-hidden"
        style={{ position: 'relative', marginBottom: 0 }}
      >
        <style>{`
          @keyframes smoothLoopFade {
            0% { opacity: 0.55; }
            92% { opacity: 0.55; }
            96% { opacity: 0.45; }
            100% { opacity: 0.55; }
          }
          .territory-video {
            animation: smoothLoopFade 0.1s linear;
          }
        `}</style>

        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/Company Images/territory-still.png"
          className="territory-video"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.55
          }}
        >
          <source src="/Company Images/territory_loop.mp4" type="video/mp4" />
        </video>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '0px' }}>
            {/* Eyebrow */}
            <p className="eyebrow-premium manual-lines" style={{
              fontFamily: 'The Seasons, serif',
              fontWeight: '700',
              fontSize: '10px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#C8A020',
              marginBottom: '8px'
            }}>
              <span className="eyebrow-line" style={{ background: 'linear-gradient(90deg, transparent, #C8A020)' }}></span>
              WHERE WE OPERATE
              <span className="eyebrow-line" style={{ background: 'linear-gradient(90deg, #C8A020, transparent)' }}></span>
            </p>

            {/* Title */}
            <h2 className="metallic-gold" style={{
              fontFamily: 'The Seasons, serif',
              fontWeight: '800',
              fontSize: '32px',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
              letterSpacing: '0.5px'
            }}>
              SERVICE TERRITORY
            </h2>

            {/* White Line */}
            <div style={{
              width: '100%',
              height: '1px',
              backgroundColor: '#ffffff',
              opacity: '0.2',
              margin: '0 0 20px 0'
            }}></div>




          </div>

          <SimpleMap />
        </div>
      </section>
    </div>
  )
}
