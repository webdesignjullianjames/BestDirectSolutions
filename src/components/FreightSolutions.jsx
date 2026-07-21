import { useState } from 'react'

export default function FreightSolutions() {
  const [hoveredStep, setHoveredStep] = useState(null)
  // Equipment spec table is collapsed by default on mobile — five stacked
  // cards is a long scroll for a reference table most visitors skim past.
  // Has no effect at desktop width, where the table always renders open.
  const [specsOpen, setSpecsOpen] = useState(false)

  const trailerTypes = [
    {
      id: 'dryvan',
      title: 'DRY VAN',
      description: 'Temperature-controlled transport for perishable and climate-sensitive freight, monitored end to end.',
      cargo: ['Fresh produce, frozen foods, and dairy', 'Pharmaceuticals and seafood'],
      image: '/Company Images/fridge_semi(2).png'
    },
    {
      id: 'reefer',
      title: 'REEFER',
      description: 'Enclosed protection for general freight — weather-safe transport for packaged and palletized goods.',
      cargo: ['Retail, electronics, and consumer goods', 'General LTL and FTL'],
      image: '/Company Images/reefer_semi(2).png'
    },
    {
      id: 'flatbed',
      title: 'FLATBED',
      description: 'Our roots. Specialized securement and precision handling for oversized, heavy, and irregular freight.',
      cargo: ['Steel coils, beams, and heavy equipment', 'Oversized loads and construction materials'],
      image: '/Company Images/dryvan_semi(2).png'
    }
  ]

  return (
    <section className="py-20 border-t border-[#C9A86C] relative bg-[#0A0A0A]">
      {/* Background Image */}
      <img
        src="/Company Images/contact-page-bg.jpg"
        alt="freight solutions background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.35
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Eyebrow */}
          <p className="eyebrow-premium" style={{
            fontFamily: 'The Seasons, serif',
            fontWeight: '700',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C8A020',
            marginBottom: '12px'
          }}>
            WHAT WE HAUL
          </p>

          {/* Title */}
          <h2 className="metallic-gold" style={{
            fontFamily: 'The Seasons, serif',
            fontWeight: '800',
            fontSize: '30px',
            textTransform: 'uppercase',
            margin: '0 0 8px 0'
          }}>
            FREIGHT SOLUTIONS
          </h2>

          {/* White Line */}
          <div style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#ffffff',
            opacity: '0.2',
            margin: '0 0 20px 0'
          }}></div>


          {/* Subtitle */}
          <style>{`
            @keyframes subtleGlow {
              0%, 100% { text-shadow: 0 0 10px rgba(200, 160, 32, 0.2), 0 0 20px rgba(200, 160, 32, 0.1); }
              50% { text-shadow: 0 0 15px rgba(200, 160, 32, 0.3), 0 0 30px rgba(200, 160, 32, 0.15); }
            }
            .subtitle-premium {
              animation: subtleGlow 4s ease-in-out infinite;
            }
            .metallic-gold {
              background: linear-gradient(180deg, #F2D878 0%, #E4C050 35%, #C8A020 70%, #A8861A 100%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              filter: drop-shadow(0 1px 0 rgba(60, 44, 8, 0.9))
                      drop-shadow(0 2px 1px rgba(0, 0, 0, 0.55))
                      drop-shadow(0 6px 14px rgba(0, 0, 0, 0.65));
            }
          `}</style>
          <p className="subtitle-premium" style={{
            fontSize: '14px',
            color: '#B8C5D0',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.8',
            letterSpacing: '0.3px',
            fontWeight: '400'
          }}>
            From steel coils to temperature-sensitive freight — Best Direct Solutions runs three trailer types to move whatever your business needs, wherever it needs to go.
          </p>
        </div>

        {/* Three-Column Grid */}
        <div className="fs-three-col" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {trailerTypes.map((trailer) => {
            return (
              <div
                key={trailer.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '28px',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C8A020'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(200, 160, 32, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Content Box */}
                <div style={{
                  background: 'linear-gradient(135deg, #1F1F1F 0%, #2A2A2A 50%, #1F1F1F 100%)',
                  padding: '16px 14px',
                  borderRadius: '6px 6px 0 0',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Subtle gold accent overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top right, rgba(200, 160, 32, 0.08) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}></div>
                  {/* Title */}
                  <h3 className="metallic-gold" style={{
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '800',
                    fontSize: '32px',
                    margin: '0 0 12px 0',
                    paddingBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #C8A020',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {trailer.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'The Seasons', serif",
                    fontSize: '13px',
                    color: '#D8D8D8',
                    margin: '0 0 16px 0',
                    lineHeight: '1.6',
                    position: 'relative',
                    zIndex: 1,
                    fontWeight: '500',
                    letterSpacing: '0.2px',
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased'
                  }}>
                    {trailer.description}
                  </p>

                  {/* Cargo List */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {trailer.cargo.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontFamily: "'The Seasons', serif",
                          fontSize: '12px',
                          color: '#D8D8D8',
                          fontWeight: '500',
                          letterSpacing: '0.15px',
                          textRendering: 'optimizeLegibility',
                          WebkitFontSmoothing: 'antialiased'
                        }}
                      >
                        <span style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#C8A020',
                          flexShrink: 0
                        }}></span>
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Request Quote Button */}
                  <a href="/contact?type=freight" style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    backgroundColor: '#C8A020',
                    color: '#0A0A0A',
                    fontSize: '13px',
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease',
                    marginTop: '20px',
                    boxShadow: '0 2px 8px rgba(200, 160, 32, 0.3)',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D4B96A'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(200, 160, 32, 0.5)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#C8A020'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(200, 160, 32, 0.3)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  >
                    Request Quote
                  </a>
                </div>

                {/* Truck Image Area */}
                <div style={{
                  backgroundColor: '#1A1E24',
                  height: 'auto',
                  aspectRatio: '2000 / 1333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0 0 6px 6px',
                  overflow: 'hidden',
                  padding: '0px'
                }}>
                  <img
                    src={trailer.image}
                    alt={trailer.title}
                    style={{
                      maxHeight: 'none',
                      maxWidth: 'none',
                      height: '280px',
                      width: 'auto',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      filter: 'contrast(1.15) brightness(1.08) saturate(1.1)'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Service Comparison Table */}
        <div style={{
          marginTop: '64px'
        }}>
        <div className="spec-section" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          marginLeft: '100px'
        }}>
          <h3 className="spec-section-title" style={{
            fontFamily: 'The Seasons, serif',
            fontSize: '24px',
            color: '#F5F6F7',
            textTransform: 'uppercase',
            marginBottom: '32px',
            textAlign: 'center',
            paddingLeft: '24px',
            paddingRight: '24px'
          }}>
            Equipment Specifications
          </h3>
          <button
            type="button"
            className="spec-section-toggle"
            aria-expanded={specsOpen}
            aria-controls="spec-section-body"
            onClick={() => setSpecsOpen(open => !open)}
          >
            Equipment Specifications
          </button>
          <div
            id="spec-section-body"
            className={`spec-section-body${specsOpen ? ' is-open' : ''}`}
            style={{
              overflowX: 'auto',
              backgroundColor: 'rgba(26, 30, 36, 0.4)',
              borderRadius: '6px',
              border: '1px solid rgba(200, 160, 32, 0.2)'
            }}>
            <table className="spec-table" style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px',
              position: 'relative',
              zIndex: 1,
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #C8A020' }}>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '700',
                    color: '#C8A020',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Spec</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '700',
                    color: '#C8A020',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Dry Van</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '700',
                    color: '#C8A020',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Reefer</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '700',
                    color: '#C8A020',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Flatbed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { spec: 'Max Capacity', dry: '45,000 lbs', reefer: '43,000 lbs', flat: '48,000 lbs' },
                  { spec: 'Dimensions', dry: '53\' × 8.6\' × 9\'', reefer: '53\' × 8.6\' × 9\'', flat: '53\' × 8.5\' flatbed' },
                  { spec: 'Temperature', dry: 'Standard', reefer: '-20°F to 55°F', flat: 'Standard' },
                  { spec: 'GPS Tracking', dry: 'Yes', reefer: 'Yes + Temp', flat: 'Yes' },
                  { spec: 'Coverage', dry: '14 states', reefer: '12 states', flat: '10 states' }
                ].map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: idx < 4 ? '1px solid rgba(200, 160, 32, 0.1)' : 'none'
                  }}>
                    <td style={{
                      padding: '14px 16px',
                      fontFamily: 'The Seasons, serif',
                      fontWeight: '700',
                      color: '#C8A020',
                      fontSize: '13px',
                      letterSpacing: '0.3px'
                    }}>{row.spec}</td>
                    {/* data-label feeds the stacked mobile layout: below 700px
                        the header row is hidden and each cell prints its own
                        column name from this attribute via ::before. */}
                    <td data-label="Dry Van" style={{
                      padding: '14px 16px',
                      textAlign: 'center',
                      fontFamily: "'The Seasons', serif",
                      color: '#D8D8D8',
                      fontSize: '13px',
                      fontWeight: '500',
                      letterSpacing: '0.2px'
                    }}>{row.dry}</td>
                    <td data-label="Reefer" style={{
                      padding: '14px 16px',
                      textAlign: 'center',
                      fontFamily: "'The Seasons', serif",
                      color: '#D8D8D8',
                      fontSize: '13px',
                      fontWeight: '500',
                      letterSpacing: '0.2px'
                    }}>{row.reefer}</td>
                    <td data-label="Flatbed" style={{
                      padding: '14px 16px',
                      textAlign: 'center',
                      fontFamily: "'The Seasons', serif",
                      color: '#D8D8D8',
                      fontSize: '13px',
                      fontWeight: '500',
                      letterSpacing: '0.2px'
                    }}>{row.flat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      {/* How It Works - Compact Timeline */}
      <div style={{
        maxWidth: '1400px',
        margin: '64px auto 0'
      }}>
      <div style={{
        padding: '26px 28px',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
          {/* Title */}
          <h3 style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '24px',
            fontWeight: '800',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            margin: '0 0 7px 0',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)'
          }}>
            HOW IT <span style={{ color: '#C8A020' }}>WORKS</span>
          </h3>

          {/* Gold Rule */}
          <div style={{
            width: '40px',
            height: '3px',
            backgroundColor: '#C8A020',
            margin: '7px auto 22px'
          }}></div>

          {/* Numbered Timeline */}
          <div className="fs-timeline" style={{
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            paddingBottom: '40px'
          }}>
            {/* Connector Line */}
            <div className="fs-timeline-connector" style={{
              position: 'absolute',
              top: '15px',
              left: '12%',
              right: '12%',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(200,160,32,0.12), rgba(200,160,32,0.5), rgba(200,160,32,0.5), rgba(200,160,32,0.12))',
              zIndex: 0
            }}></div>

            {/* Steps Grid */}
            <div className="fs-steps-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              position: 'relative',
              zIndex: 1
            }}>
              {[
                { num: '1', title: 'REQUEST', desc: 'Tell us your freight needs' },
                { num: '2', title: 'QUOTE', desc: 'Get competitive pricing' },
                { num: '3', title: 'BOOK', desc: 'Schedule your shipment' },
                { num: '4', title: 'DELIVER', desc: 'Track with GPS to delivery' }
              ].map((step, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  {/* Numbered Circle */}
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '1.5px solid #C8A020',
                    backgroundColor: '#0D0F12',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 11px',
                    position: 'relative',
                    zIndex: 2,
                    fontFamily: "'The Seasons', serif",
                    fontSize: '14px',
                    fontWeight: '800',
                    color: '#C8A020'
                  }}>
                    {step.num}
                  </div>

                  {/* Step Title */}
                  <div style={{
                    fontFamily: "'The Seasons', serif",
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#C8A020',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
                  }}>
                    {step.title}
                  </div>

                  {/* Step Description */}
                  <div style={{
                    fontSize: '11px',
                    color: '#E8E8E8',
                    lineHeight: '1.45',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
                  }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Info Strip */}
          <div style={{
            maxWidth: '900px',
            margin: '22px auto 0',
            paddingTop: '16px',
            borderTop: '1px solid rgba(200,160,32,0.12)',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0'
          }}>
            {[
              { label: 'SERVICE AREA', value: '36 States' },
              { label: 'TRANSIT', value: '2–4 Days · 99.2% On-Time' },
              { label: 'CERTIFIED', value: 'DOT & FMCSA' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '0 18px',
                borderRight: idx < 2 ? '1px solid rgba(200,160,32,0.15)' : 'none',
                display: 'flex',
                gap: '7px',
                alignItems: 'center'
              }}>
                <span style={{
                  fontFamily: "'The Seasons', serif",
                  fontSize: '9.5px',
                  fontWeight: '700',
                  color: '#D8D8D8',
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: "'The Seasons', serif",
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#C8A020',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Responsive Styles

              These rules previously targeted inline styles by attribute
              substring — div[style*="gridTemplateColumns: repeat(4, 1fr)"] —
              and were dead on arrival for two separate reasons:

                1. React emits inline styles kebab-cased into the DOM, so the
                   attribute reads "grid-template-columns: repeat(4, 1fr)".
                   The camelCase substring never appeared and never matched.
                2. The declarations inside used JS property names
                   (gridTemplateColumns, paddingBottom) rather than CSS ones,
                   so browsers discarded them even where a selector did match.

              Rewritten against real classes with valid CSS. Mobile only —
              every selector below is scoped to the media query and the classes
              carry no base rules, so desktop is unaffected. */}
          <style>{`
            @media (max-width: 760px) {
              /* Four steps at ~190px each will not fit a phone; go two-up and
                 open the row gap so the numbers do not crowd. */
              .fs-steps-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 20px 10px !important;
              }

              /* The connector is a single horizontal rule sized to span four
                 columns in one row. Across two rows it would cut through the
                 second row's numbers, so it is dropped rather than reflowed. */
              .fs-timeline-connector {
                display: none !important;
              }

              .fs-timeline {
                padding-bottom: 0 !important;
              }
            }

            /* Three equal columns at 32px gaps leaves ~100px per card on a
               phone. Single column below 900px; two-up is skipped because the
               cards carry body copy, not just a label. */
            @media (max-width: 900px) {
              .fs-three-col {
                grid-template-columns: 1fr !important;
                gap: 24px !important;
              }
              /* A hardcoded 100px left offset that centres the block against
                 the desktop layout. On a 390px screen it swallows a quarter of
                 the width and pushes the table off the right edge. */
              .spec-section {
                margin-left: auto !important;
                padding: 0 12px;
              }
            }

            /* Equipment specs collapse on mobile. The heading becomes the tap
               target; the desktop <h3> is hidden and the button carries the
               same text. Both are display:none-guarded so desktop is
               unaffected: the button never renders there and the body has no
               base rule, so the table is always open above 700px. */
            .spec-section-toggle { display: none; }

            @media (max-width: 700px) {
              .spec-section-title { display: none; }
              .spec-section-toggle {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 15px 16px;
                margin-bottom: 12px;
                background: rgba(26, 30, 36, 0.4);
                border: 1px solid rgba(200, 160, 32, 0.2);
                border-radius: 6px;
                cursor: pointer;
                font-family: 'The Seasons', serif;
                font-size: 15px;
                color: #F5F6F7;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                text-align: left;
              }
              .spec-section-toggle::after {
                content: '';
                width: 8px;
                height: 8px;
                flex-shrink: 0;
                border-right: 2px solid #C8A020;
                border-bottom: 2px solid #C8A020;
                transform: translateY(-2px) rotate(45deg);
                transition: transform 0.25s ease;
              }
              .spec-section-toggle[aria-expanded="true"]::after {
                transform: translateY(2px) rotate(-135deg);
              }
              .spec-section-body { display: none; }
              .spec-section-body.is-open { display: block; }
            }

            /* Equipment table -> stacked cards.

               The table is 4 columns held open by min-width: 800px inside an
               overflow-x wrapper. That technically works — it scrolls — but on
               a phone it reads as content cut off at the edge, and the scroll
               is easy to miss entirely.

               Below 700px the table stops being a table: the header row is
               dropped and each row becomes a card titled with its spec name,
               with the three equipment columns listed underneath as
               label/value pairs. Column names come from data-label on each
               cell, printed via ::before, so nothing is duplicated in markup.

               Desktop is untouched — all of this is inside the media query and
               min-width: 800px still governs above it. */
            @media (max-width: 700px) {
              .spec-table {
                min-width: 0 !important;
                display: block;
              }
              .spec-table thead {
                /* Hidden visually; column names are reprinted per cell below.
                   Not display:none on the table itself so semantics survive. */
                display: none;
              }
              .spec-table tbody,
              .spec-table tr,
              .spec-table td {
                display: block;
                width: 100%;
              }
              .spec-table tr {
                border-bottom: none !important;
                margin: 0 12px 12px;
                width: auto;
                border: 1px solid rgba(200, 160, 32, 0.18);
                border-radius: 6px;
                background: rgba(200, 160, 32, 0.04);
                overflow: hidden;
              }
              .spec-table tbody { padding-top: 12px; }

              /* First cell is the spec name — becomes the card heading. */
              .spec-table td:first-child {
                background: rgba(200, 160, 32, 0.10);
                border-bottom: 1px solid rgba(200, 160, 32, 0.18);
                padding: 10px 14px !important;
                font-size: 12px !important;
                text-transform: uppercase;
                letter-spacing: 1px !important;
              }

              /* Remaining cells: column name left, value right. */
              .spec-table td:not(:first-child) {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: 16px;
                text-align: right !important;
                padding: 9px 14px !important;
              }
              .spec-table td:not(:first-child)::before {
                content: attr(data-label);
                flex-shrink: 0;
                color: #8A919A;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.6px;
                text-transform: uppercase;
                text-align: left;
              }
            }
          `}</style>
      </div>
      </div>
    </section>
  )
}
