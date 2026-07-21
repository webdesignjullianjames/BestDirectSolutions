import { Link } from 'react-router-dom'

// Broken glyphs in The Seasons are handled globally by the unicode-range split in
// index.css. This only gives figures the branded Rajdhani treatment.
function renderText(text) {
  return text.split(/(\d+(?:[+%])?)/).map((part, i) =>
    /^\d/.test(part)
      ? <span key={i} style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>{part}</span>
      : part
  )
}

export default function Team() {
  const founders = [
    {
      name: 'Julian James',
      title: 'FOUNDING PARTNER & CEO',
      quote: '"Leadership is forged in service and driven by unwavering commitment."',
      bio: 'U.S. Army veteran and founder of Best Direct Solutions. Julian brings military precision and accountability to every load, every route, and every client relationship.',
      image: '/Company Images/founder-julian.png',
      photoPosition: 'center 12%',
      credentials: [
        { label: 'U.S. ARMY VETERAN', style: 'filled' },
        { label: 'CEO & FOUNDER', style: 'outlined' }
      ],
      highlights: ['15+ Years Logistics', '100% On-Time Delivery', 'Fleet Expansion']
    },
    {
      name: 'Bruce Burgess',
      title: 'FOUNDING PARTNER & COO',
      quote: '"Professionalism isn\'t just a standard; it\'s our uncompromising promise."',
      bio: 'Co-founder and operations lead at Best Direct Solutions. Bruce ensures every shipment meets the company\'s uncompromising standards for safety, timing, and professionalism.',
      image: '/Company Images/founder-bruce.png',
      photoPosition: 'center 18%',
      credentials: [
        { label: 'CO-FOUNDER', style: 'outlined' },
        { label: 'OPERATIONS LEAD', style: 'outlined' }
      ],
      highlights: ['Certified Logistics', 'Safety Expert', 'Driver Training']
    }
  ]

  // Figures already claimed elsewhere on the site — verify before launch.
  const stats = [
    { value: '15+', label: 'Years Logistics' },
    { value: '100%', label: 'On-Time Delivery' },
    { value: '3', label: 'Trailer Types' },
    { value: '24/7', label: 'Support' }
  ]

  // Icons are single-colour black SVGs, applied as CSS masks rather than <img>
  // so they inherit the band's ink colour instead of being stuck at #000.
  const values = [
    {
      title: 'Safety First',
      description: 'Every driver, every delivery, every mile is executed with the highest safety standards.',
      icon: '/Company Images/page icons/safety first.png',
      // Line art: fills the box, and still takes a touch more ink than the solid
      // SVG marks so its thin strokes read at the same weight. The gap is much
      // smaller than it was at low alpha — both are near-opaque now.
      iconScale: '100%',
      iconInk: 1
    },
    {
      title: 'Professional Excellence',
      description: 'Our team is trained, certified, and committed to delivering exceptional service.',
      icon: '/Company Images/page icons/professional excellence.png',
      // Same line-art treatment as the shield. Scaled to 92% rather than 100%
      // because the medal's ribbon makes the artwork taller than it is wide —
      // at full scale its medallion would read smaller than its neighbours.
      iconScale: '92%',
      iconInk: 1
    },
    {
      title: 'Customer Focus',
      description: 'Our clients\' success is our top priority.',
      icon: '/Company Images/page icons/customer-focus.png',
      // Line art, so it takes the full ink like the shield and the medal. Unlike
      // those two the source is 330x360 rather than square, and mask-size sets
      // width with height auto — at 100% it would render 56x61 and clip against
      // the fixed 56px box. 88% puts the taller axis at ~54px, just inside.
      iconScale: '88%',
      iconInk: 1
    },
    {
      title: 'Continuous Growth',
      description: 'We are always expanding our capabilities.',
      icon: '/Company Images/page icons/continuous-growth.png',
      // Line art, so full ink like the rest. Scaled past 100% — unusual here —
      // because the truck occupies only the middle half of its 330x360 canvas
      // (90px of empty space above and below). At 88% it would render a ~38px
      // truck and read far smaller than its neighbours. 110% brings it to ~48px
      // wide, matching Customer Focus; the overflow clips 5.6px into 16.8px of
      // vertical padding and 2.8px into 6.9px horizontal, so no ink is lost.
      iconScale: '110%',
      iconInk: 1
    }
  ]

  return (
    <div style={{
      background: '#0D0F12',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility'
    }}>
      <style>{`
        .metallic-gold {
          background: linear-gradient(180deg, #F2D878 0%, #E4C050 35%, #C8A020 70%, #A8861A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 0 rgba(60, 44, 8, 0.75));
        }
        .leader-hero {
          position: relative;
          height: 380px;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .leader-hero-half {
          position: relative;
          overflow: hidden;
        }
        .leader-hero-half img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .leader-hero-half::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(13, 15, 18, 0.45);
        }
        .leader-hero-half.left::after {
          background: linear-gradient(90deg, rgba(13,15,18,0.75), rgba(13,15,18,0.35));
        }
        .leader-hero-half.right::after {
          background: linear-gradient(90deg, rgba(13,15,18,0.35), rgba(13,15,18,0.75));
        }
        .leader-hero-seam {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(180deg,
            transparent,
            rgba(200, 160, 32, 0.55) 20%,
            rgba(200, 160, 32, 0.55) 80%,
            transparent);
          z-index: 4;
        }
        .leader-hero-title {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          padding: 0 24px;
        }
        .leader-hero-title h1 {
          font-family: 'The Seasons', serif;
          font-weight: 800;
          font-size: 46px;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin: 0;
          background: linear-gradient(180deg, #F2D878 0%, #E4C050 35%, #C8A020 70%, #A8861A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 0 rgba(60, 44, 8, 0.85))
                  drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
        }
        /* Background zone: spans founder profiles → stat band → values band →
           CTA. Image and scrim are separate layers so the image can be graded
           independently — a flat overlay at high alpha crushes the photo's
           contrast range and reads muddy. */
        .leadership-bg {
          position: relative;
          background: #0D0F12;
          isolation: isolate;
        }
        /* Image layer. Explicit z-index puts it under ::before despite the
           normal paint order. Graded to recover the sunset's warmth through
           the scrim. */
        .leadership-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: url('/Company Images/leadership-background.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          filter: contrast(1.18) saturate(1.3) brightness(1.06);
        }
        /* Scrim plus both edge fades in one gradient: solid #0D0F12 at the top
           and bottom edges so there is no seam against the hero or footer,
           easing to a flat 0.62 wash across the middle. */
        .leadership-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            #0D0F12 0,
            rgba(13, 15, 18, 0.62) 90px,
            rgba(13, 15, 18, 0.62) calc(100% - 90px),
            #0D0F12 100%
          );
        }
        .leadership-bg > * {
          position: relative;
          z-index: 2;
        }
        /* Fixed attachment is unreliable on mobile browsers — fall back to
           normal scroll below 768px. */
        @media (max-width: 768px) {
          .leadership-bg::after {
            background-attachment: scroll;
          }
        }
        .founder-row {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .founder-photo-frame {
          flex-shrink: 0;
          position: relative;
          border: 1px solid rgba(200, 160, 32, 0.35);
          padding: 4px;
          overflow: hidden;
          transition: border-color 0.25s ease;
        }
        .founder-photo-frame::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 18px;
          height: 18px;
          border-top: 2px solid #C8A020;
          border-left: 2px solid #C8A020;
        }
        .founder-row:hover .founder-photo-frame {
          border-color: #C8A020;
        }
        .founder-row img {
          display: block;
          width: 180px;
          height: 240px;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .founder-row:hover img {
          transform: scale(1.04);
        }
        .cred-pill {
          font-family: 'The Seasons', serif;
          font-weight: 700;
          font-size: 9px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          display: inline-block;
        }
        .cred-pill.filled {
          background: #C8A020;
          border: 1px solid #C8A020;
          color: #0D0F12;
        }
        .cred-pill.outlined {
          background: transparent;
          border: 1px solid #C8A020;
          color: #C8A020;
        }
        .founder-highlights {
          list-style: none;
          margin: 12px 0 0 0;
          padding: 0;
        }
        .founder-highlights li {
          font-family: 'The Seasons', serif;
          font-weight: 600;
          font-size: 12px;
          color: #C8A020;
          line-height: 1.9;
          padding-left: 14px;
          position: relative;
        }
        .founder-highlights li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 9px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #C8A020;
        }
        .join-team-btn {
          font-family: 'The Seasons', serif;
          font-weight: 800;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0D0F12;
          background: linear-gradient(180deg, #E4C050, #C8A020);
          padding: 14px 40px;
          border-radius: 2px;
          display: inline-block;
          text-decoration: none;
          box-shadow: 0 0 24px rgba(200, 160, 32, 0.5);
          transition: box-shadow 0.2s ease;
        }
        .join-team-btn:hover {
          box-shadow: 0 0 36px rgba(200, 160, 32, 0.75);
        }
        .founders-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .founders-grid > .founder-row:first-child {
          padding-right: 44px;
          border-right: 1px solid rgba(200, 160, 32, 0.18);
        }
        .stat-band {
          border-top: 1px solid rgba(200, 160, 32, 0.18);
          border-bottom: 1px solid rgba(200, 160, 32, 0.18);
          background: rgba(200, 160, 32, 0.035);
          padding: 26px 24px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .stat-item {
          text-align: center;
          border-right: 1px solid rgba(200, 160, 32, 0.18);
        }
        .stat-item:last-child {
          border-right: none;
        }
        /* The unicode-range split in index.css keeps digits and symbols off the
           broken Seasons glyphs, so this stays clean. Solid fill rather than the
           metallic gradient, which muddies figures at this size. */
        .stat-value {
          font-family: 'The Seasons', serif;
          font-weight: 700;
          font-size: 32px;
          line-height: 1.1;
          letter-spacing: 0.5px;
          color: #E4C050;
          font-variant-numeric: tabular-nums;
          font-feature-settings: 'tnum' 1;
        }
        .stat-label {
          font-family: 'The Seasons', serif;
          font-weight: 600;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8A919A;
          margin-top: 5px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: minmax(120px, 140px) repeat(4, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        /* The heading is the grid's first cell, not a block above it, so it costs
           the band no height at all — it occupies the column beside the icons
           instead of a row above them.

           It previously sat above the grid on a margin-bottom: -43px, which pulled
           the icons up onto the heading's line so the outer two flanked it. That
           framing only worked while the icons were faint tone-on-tone marks; at
           full ink it read as a collision. Moving the heading into the grid keeps
           the band's original height without needing the icons to stay faint.

           Stacked one word per line and centred, so OUR sits centred over SHARED
           over VALUES. The column width does the line-breaking rather than markup:
           at ~120px of content it is wider than SHARED (~107px) but narrower than
           OUR SHARED (~169px), so the three words always break the same way. That
           was previously a coin flip — the old 190px column left ~170px of content
           against a ~169px phrase, so the wrap depended on exact font metrics.
           Vertically centred against the taller value columns, and taking the same
           hairline right border as .value-item so it reads as part of the row
           rather than a floating label. */
        .values-heading {
          align-self: center;
          text-align: center;
          line-height: 1.15;
          padding-right: 20px;
          border-right: 1px solid rgba(13, 15, 18, 0.15);
        }
        /* Hairline dividers between values, matching the .stat-item idiom used
           in the band above — structure rather than decoration. */
        .value-item {
          text-align: center;
          padding: 0 20px;
          border-right: 1px solid rgba(13, 15, 18, 0.15);
        }
        .value-item:last-child {
          border-right: none;
        }
        /* No frame — the icon sits straight on the gold, in the same near-black
           ink as the heading and titles so the band stays a two-colour system.
           At full strength this reads as a solid mark rather than the debossed
           stamp it used to be; the 1px white drop-shadow is kept because it still
           crisps the lower edge against the gold. To go back to the recessed
           look, drop --icon-ink to ~0.24 (0.5 for the line art). */
        /* Fixed 56px box for every icon so the titles stay on one line across
           all four columns; apparent size is tuned per-icon via --icon-scale
           instead of by resizing the box. --icon-ink lets line-art marks carry
           a heavier fill than solid glyphs — thin strokes cover far less area,
           so they need more alpha to read at the same perceived weight. */
        .value-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 10px;
          background-color: rgba(13, 15, 18, var(--icon-ink, 0.9));
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: var(--icon-scale, 75%);
          mask-size: var(--icon-scale, 75%);
          filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.38));
          transition: background-color 0.3s ease;
        }
        .value-item:hover .value-icon {
          background-color: rgba(13, 15, 18, calc(var(--icon-ink, 0.9) + 0.1));
        }
        .value-rule {
          width: 20px;
          height: 1px;
          margin: 9px auto 10px;
          background: rgba(13, 15, 18, 0.3);
          transition: width 0.3s ease;
        }
        .value-item:hover .value-rule {
          width: 32px;
        }
        @media (max-width: 800px) {
          .founders-grid {
            grid-template-columns: 1fr;
          }
          .founders-grid > .founder-row:first-child {
            padding-right: 0;
            padding-bottom: 36px;
            border-right: none;
            border-bottom: 1px solid rgba(200, 160, 32, 0.18);
          }
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          /* Value items are children 2-5 because the heading is child 1, so the
             right-hand column of the two-up grid is the ODD children, not even. */
          .value-item:nth-child(odd) {
            border-right: none;
          }
          /* Below this width there is no room for a side column, so the heading
             spans the full row and goes back to sitting above the icons. The band
             is taller here regardless — the grid has stacked into two rows. */
          .values-heading {
            grid-column: 1 / -1;
            text-align: center;
            padding-right: 0;
            border-right: none;
            margin-bottom: 2px !important;
          }
          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 20px;
          }
          .stat-item:nth-child(2) {
            border-right: none;
          }
          .leader-hero-title h1 {
            font-size: 32px;
          }
        }
        @media (max-width: 500px) {
          .values-grid {
            grid-template-columns: 1fr;
          }
          .value-item {
            border-right: none;
          }
          .founder-row {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .founder-highlights li {
            text-align: left;
          }
        }
      `}</style>

      {/* SPLIT-PORTRAIT HERO */}
      <section className="leader-hero">
        <div className="leader-hero-half left">
          <img
            src="/Company Images/founder-julian.png"
            alt="Julian James"
            style={{ objectPosition: 'center 18%' }}
          />
        </div>
        <div className="leader-hero-half right">
          <img
            src="/Company Images/founder-bruce.png"
            alt="Bruce Burgess"
            style={{ objectPosition: 'center 20%' }}
          />
        </div>
        <div className="leader-hero-seam"></div>
        <div className="leader-hero-title">
          <h1>LEADERSHIP FORGED IN SERVICE</h1>
        </div>
      </section>

      <div className="leadership-bg">
      {/* FOUNDER PROFILES */}
      <section style={{ padding: '56px 24px' }}>
        <div className="founders-grid">
          {founders.map((founder, idx) => (
            <div key={idx} className="founder-row">
              <div className="founder-photo-frame">
                <img
                  src={founder.image}
                  alt={founder.name}
                  style={{ objectPosition: founder.photoPosition }}
                />
              </div>
              <div>
                {/* Name */}
                <h2 className="metallic-gold" style={{
                  fontFamily: "'The Seasons', serif",
                  fontWeight: '800',
                  fontSize: '24px',
                  margin: '0 0 2px 0'
                }}>
                  {renderText(founder.name)}
                </h2>

                {/* Title */}
                <p style={{
                  fontFamily: "'The Seasons', serif",
                  fontWeight: '700',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#C8A020',
                  margin: '0 0 10px 0'
                }}>
                  {renderText(founder.title)}
                </p>

                {/* Quote */}
                <p style={{
                  fontFamily: "'The Seasons', serif",
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  lineHeight: '1.5',
                  margin: '0 0 10px 0'
                }}>
                  {renderText(founder.quote)}
                </p>

                {/* Bio */}
                <p style={{
                  fontFamily: "'The Seasons', serif",
                  fontSize: '12.5px',
                  color: '#C8CDD3',
                  lineHeight: '1.6',
                  margin: '0 0 12px 0'
                }}>
                  {renderText(founder.bio)}
                </p>

                {/* Credential Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {founder.credentials.map((cred, credIdx) => (
                    <span key={credIdx} className={`cred-pill ${cred.style}`}>
                      {renderText(cred.label)}
                    </span>
                  ))}
                </div>

                {/* Gold Bullet Highlights */}
                <ul className="founder-highlights">
                  {founder.highlights.map((item, itemIdx) => (
                    <li key={itemIdx}>{renderText(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAT BAND */}
      <section className="stat-band">
        <div className="stat-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{renderText(stat.label)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR SHARED VALUES — GOLD BAND */}
      {/* Narrow value range across the band — the original #C8A020 → #A8861A
          spread reads as a web gradient at this size and can band on 8-bit
          displays. This holds closer to a single tone with a whisper of sheen. */}
      <section style={{
        background: 'linear-gradient(180deg, #C6A022 0%, #C09A1F 55%, #B7911B 100%)',
        padding: '22px 24px 34px'
      }}>
        <div className="values-grid">
          {/* First grid cell rather than a block above the grid — see the
              .values-heading note in the style block for why. */}
          <h2 style={{
            fontFamily: "'The Seasons', serif",
            fontWeight: '800',
            fontSize: '28px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
            color: '#0D0F12'
          }} className="values-heading">
            OUR SHARED <span style={{ color: '#FFFFFF' }}>VALUES</span>
          </h2>

          {values.map((value, idx) => (
            <div key={idx} className="value-item">
              <div
                className="value-icon"
                style={{
                  WebkitMaskImage: `url('${value.icon}')`,
                  maskImage: `url('${value.icon}')`,
                  ...(value.iconScale && { '--icon-scale': value.iconScale }),
                  ...(value.iconInk && { '--icon-ink': value.iconInk })
                }}
              />
              <h3 style={{
                fontFamily: "'The Seasons', serif",
                fontWeight: '700',
                fontSize: '16px',
                letterSpacing: '0.6px',
                color: '#0D0F12',
                margin: 0
              }}>
                {renderText(value.title)}
              </h3>
              <div className="value-rule" />
              <p style={{
                fontFamily: "'The Seasons', serif",
                fontSize: '11.5px',
                color: '#FFFFFF',
                lineHeight: '1.5',
                margin: 0
              }}>
                {renderText(value.description)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN OUR TEAM CTA */}
      <div style={{
        textAlign: 'center',
        marginTop: '-25px',
        paddingBottom: '48px',
        position: 'relative',
        zIndex: 5
      }}>
        <Link to="/contact" className="join-team-btn">
          JOIN OUR TEAM
        </Link>
        <p style={{
          fontFamily: "'The Seasons', serif",
          fontSize: '12.5px',
          color: '#8A919A',
          margin: '18px 0 0 0'
        }}>
          {renderText('Drivers who share our standards — we want to meet you.')}
        </p>
        <Link
          to="/about#mission-section"
          style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#C8A020',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '10px'
          }}
        >
          {renderText('Read our mission →')}
        </Link>
      </div>
      </div>
    </div>
  )
}
