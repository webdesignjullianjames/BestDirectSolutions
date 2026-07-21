import { siteContent } from '../data/siteContent'

export default function MissionStatement() {
  // First two paragraphs only
  const missionParagraphs = siteContent.mission.description.split('\n\n').slice(0, 2).join('\n\n')

  return (
    <section
      id="mission-section"
      className="relative"
      style={{
        backgroundImage: 'url("/Company Images/mission-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '56px 0'
      }}
    >
      {/* Dark scrim overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(13, 15, 18, 0.58)',
        zIndex: 1
      }}></div>

      {/* Mission Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
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
          OUR MISSION
        </p>

        {/* Gold Rule */}
        <div style={{
          width: '40px',
          height: '2px',
          backgroundColor: '#C8A020',
          margin: '0 auto 20px'
        }}></div>

        {/* Mission Body Copy */}
        <p style={{
          fontFamily: "'The Seasons', serif",
          fontSize: '14px',
          lineHeight: '1.85',
          letterSpacing: '0.2px',
          color: '#C8CDD3',
          margin: '0 0 16px 0',
          whiteSpace: 'pre-line',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}>
          {missionParagraphs}
        </p>
      </div>
    </section>
  )
}
