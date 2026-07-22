import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SimpleMap from '../components/SimpleMap'
import MissionStatement from '../components/MissionStatement'
import FreightSolutions from '../components/FreightSolutions'
import RevealGate from '../components/RevealGate'

// The page is revealed in stages rather than handed over in one scroll.
//
//   0 — Mission + Our Standard          (what a visitor lands on)
//   1 — ...plus Freight Solutions, which ends with the How It Works timeline
//   2 — ...plus Service Territory
//
const STAGE_FREIGHT = 1
const STAGE_TERRITORY = 2

// Each gated section is linked directly from the footer, so a visitor can
// arrive with one already targeted. Maps a hash to the stage that has to be
// open for that element to exist.
const HASH_STAGE = {
  '#freight-solutions': STAGE_FREIGHT,
  '#services-section': STAGE_TERRITORY
}

export default function About() {
  const location = useLocation()
  const navigate = useNavigate()

  const [stage, setStage] = useState(0)

  // Deep links win over the gates. The footer points at #freight-solutions
  // and #services-section, and the scroll effect below looks the element up by
  // hash — if the section were still gated the lookup would find nothing and
  // the link would silently do nothing.
  //
  // Derived rather than pushed into state by an effect: the section has to
  // exist on the very first render for that effect to find it, and this repo's
  // lint rules reject setState inside an effect body.
  const openTo = Math.max(stage, HASH_STAGE[location.hash] ?? 0)

  const revealNext = (nextStage, targetId) => {
    setStage(nextStage)
    // The section is not in the DOM until React commits this state change, so
    // the scroll has to wait for the paint. Matches the delay the hash effect
    // below already uses.
    setTimeout(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Back to the top, and the page folds shut behind you.
  const handleReset = () => {
    setStage(0)
    // A visitor who arrived on a footer deep link still has #services-section
    // in the URL, and openTo reads that hash — so clearing the stage alone
    // would leave the page stubbornly open. Drop the hash too. Replace rather
    // than push, so Back still returns wherever they actually came from.
    if (location.hash) {
      navigate('/about', { replace: true })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      {/* GATE 1 — after Our Standard, opens Freight Solutions */}
      {openTo < STAGE_FREIGHT && (
        <RevealGate
          label="FREIGHT SOLUTIONS"
          controls="freight-solutions"
          // Continues the Our Standard section directly above it.
          background="#13171C"
          onReveal={() => revealNext(STAGE_FREIGHT, 'freight-solutions')}
        />
      )}

      {openTo >= STAGE_FREIGHT && (
      <>
      {/* FREIGHT SOLUTIONS SECTION
          Ends with the How It Works timeline and its stats strip, so gate 2
          below reads as sitting directly after How It Works. */}
      <section id="freight-solutions">
        <FreightSolutions />
      </section>

      {/* GATE 2 — after How It Works, opens Service Territory */}
      {openTo < STAGE_TERRITORY && (
        <RevealGate
          label="SEE TERRITORY SERVICED"
          controls="services-section"
          // Continues the Freight Solutions section, which is near-black.
          background="#0A0A0A"
          onReveal={() => revealNext(STAGE_TERRITORY, 'services-section')}
        />
      )}

      {openTo >= STAGE_TERRITORY && (
      <>
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

          {/* THE WAY BACK — the last thing on the page once everything is
              open. Returns to the top and folds the gates shut behind you, so
              the page resets to how it was found rather than staying fully
              unrolled.

              It sits inside the territory section, over the video, rather
              than in a band of its own below it. As a separate section it
              carried its own solid background, which cut a black gap between
              the map and the footer. */}
          <BackToTop onClick={handleReset} />
        </div>
      </section>
      </>
      )}
      </>
      )}
    </div>
  )
}


// The return at the foot of the page: a circular outline holding a chevron,
// with a small label beneath it.
//
// Transparent on purpose — it is rendered over the territory video, so it
// must not carry a background of its own.
function BackToTop({ onClick }) {
  return (
    <div style={{
      padding: '40px 24px 8px',
      textAlign: 'center'
    }}>
      <button type="button" onClick={onClick} className="back-to-top">
        <span className="back-to-top-circle">
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </span>
        <span>Top</span>
      </button>
    </div>
  )
}
