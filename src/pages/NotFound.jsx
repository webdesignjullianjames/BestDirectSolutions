import { Link } from 'react-router-dom'

// Deliberately built from the same parts as the About page header — eyebrow in
// Rajdhani, metallic title in The Seasons, gold rule beneath — so a wrong URL
// lands somewhere that still reads as the site rather than a bare browser page.
export default function NotFound() {
  return (
    <section style={{
      background: '#13171C',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px'
    }}>
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: '700',
          fontSize: '10px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#C8A020',
          margin: '0 0 8px 0'
        }}>
          OFF ROUTE
        </p>

        <h1 style={{
          fontFamily: "'The Seasons', serif",
          fontSize: '34px',
          fontWeight: '800',
          textTransform: 'uppercase',
          color: '#F5E6B8',
          margin: '0 0 8px 0',
          letterSpacing: '0.5px'
        }}>
          PAGE NOT FOUND
        </h1>

        <div style={{
          width: '48px',
          height: '3px',
          backgroundColor: '#C8A020',
          margin: '12px auto 20px'
        }}></div>

        <p style={{
          fontFamily: "'The Seasons', serif",
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#8A919A',
          margin: '0 0 32px 0'
        }}>
          That address does not lead anywhere on this site. It may have moved, or
          the link that brought you here may be out of date.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{
            background: '#C8A020',
            color: '#0D0F12',
            fontFamily: "'The Seasons', serif",
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '11px 26px',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            BACK TO HOME
          </Link>

          <Link to="/contact" style={{
            background: 'transparent',
            color: '#F5E6B8',
            border: '1.5px solid rgba(245,230,184,0.5)',
            fontFamily: "'The Seasons', serif",
            fontWeight: 600,
            fontSize: '0.72rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '10px 26px',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            GET A QUOTE
          </Link>
        </div>
      </div>
    </section>
  )
}
