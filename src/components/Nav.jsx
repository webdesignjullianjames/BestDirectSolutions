import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'WHY CHOOSE US' },
    { to: '/team', label: 'LEADERSHIP' },
    { to: '/contact', label: 'GET STARTED' }
  ]

  return (
    <nav className="sticky top-0 z-50 shadow-lg border-b border-[#C9A86C] bg-black relative">
      <style>{`
        @keyframes navGlow {
          0%, 100% { text-shadow: 0 0 8px rgba(200, 160, 32, 0.4), 0 0 16px rgba(200, 160, 32, 0.2); }
          50% { text-shadow: 0 0 12px rgba(200, 160, 32, 0.6), 0 0 24px rgba(200, 160, 32, 0.4); }
        }
        .nav-link-glow {
          animation: navGlow 3s ease-in-out infinite !important;
        }

        /* ------------------------------------------------------------------
           MOBILE ONLY.

           Desktop is deliberately frozen: everything below is either hidden at
           desktop width (the toggle and the panel) or lives inside the media
           query. No base rule above this line was changed, so the desktop nav
           renders exactly as it did before.

           The desktop row cannot survive a narrow viewport — it is roughly
           700px of links, a 48px truck icon and an 80px logo carrying a -320px
           left margin (Tailwind -ml-80). Rather than try to reflow that, the
           breakpoint hides it wholesale and swaps in a logo + hamburger row.
           1024px is the cutover so tablets get the working layout too.
           ------------------------------------------------------------------ */
        .nav-toggle { display: none; }
        .nav-mobile-panel { display: none; }

        @media (max-width: 1024px) {
          .nav-desktop-only { display: none !important; }

          /* Neutralise -ml-80. Without this the logo sits 320px off the left
             edge of a phone screen and drags the whole page into horizontal
             scroll. !important because it is overriding a utility class. */
          .nav-logo-link { margin-left: 0 !important; }
          .nav-logo-link img { height: 3.25rem !important; }

          .nav-row { padding-top: 6px; padding-bottom: 6px; }

          .nav-toggle {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            width: 44px;
            height: 44px;
            padding: 10px;
            background: transparent;
            border: 1px solid rgba(201, 168, 108, 0.4);
            border-radius: 4px;
            cursor: pointer;
            flex-shrink: 0;
          }
          .nav-toggle span {
            display: block;
            height: 2px;
            width: 100%;
            background: #C9A86C;
            border-radius: 2px;
            transition: transform 0.25s ease, opacity 0.2s ease;
          }
          /* Collapse the bars into an X while the panel is open. */
          .nav-toggle[aria-expanded="true"] span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
          }
          .nav-toggle[aria-expanded="true"] span:nth-child(2) {
            opacity: 0;
          }
          .nav-toggle[aria-expanded="true"] span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
          }

          .nav-mobile-panel.is-open {
            display: block;
            border-top: 1px solid rgba(201, 168, 108, 0.25);
            background: #000;
          }
          .nav-mobile-panel a {
            display: block;
            padding: 16px 24px;
            font-family: 'The Seasons', serif;
            font-weight: 600;
            letter-spacing: 1px;
            color: #8B6F47;
            text-decoration: none;
            border-bottom: 1px solid rgba(201, 168, 108, 0.12);
          }
          .nav-mobile-panel a:last-child { border-bottom: none; }
          .nav-mobile-panel a.is-active { color: #C9A86C; }
        }
      `}</style>

      <div className="nav-row max-w-7xl mx-auto px-6 py-2 flex justify-between items-center relative z-10">
        {/* LOGO + HOME */}
        <div className="flex items-center gap-8">
          <Link to="/" className="nav-logo-link flex-shrink-0 -ml-80">
            <img
              src="/Company Images/platinum-logo-alt.png"
              alt="Best Direct Solutions"
              className="h-20 w-auto object-contain"
            />
          </Link>
          {/* DIVIDER */}
          <div className="nav-desktop-only" style={{
            width: '1px',
            height: '32px',
            backgroundColor: '#8B6F47',
            opacity: 0.5
          }}></div>
          <Link
            to="/"
            className="nav-desktop-only text-[#8B6F47] font-semibold hover:text-[#A68060] transition border-b-2 border-transparent hover:border-[#A68060] nav-link-glow"
            style={{
              fontFamily: "'The Seasons', serif"
            }}
          >
            HOME
          </Link>
        </div>

        {/* CENTER MENU */}
        <ul className="nav-desktop-only flex gap-12 items-center">
          <li style={{ marginLeft: '48px' }}>
            <Link
              to="/about"
              className="text-[#8B6F47] font-semibold hover:text-[#A68060] transition border-b-2 border-transparent hover:border-[#A68060] nav-link-glow"
              style={{
                fontFamily: "'The Seasons', serif"
              }}
            >
              WHY CHOOSE US
            </Link>
          </li>
          <li>
            <Link
              to="/team"
              className="text-[#8B6F47] font-semibold hover:text-[#A68060] transition border-b-2 border-transparent hover:border-[#A68060] nav-link-glow"
              style={{
                fontFamily: "'The Seasons', serif"
              }}
            >
              LEADERSHIP
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-[#8B6F47] font-semibold hover:text-[#A68060] transition border-b-2 border-transparent hover:border-[#A68060] nav-link-glow"
              style={{
                fontFamily: "'The Seasons', serif"
              }}
            >
              GET STARTED
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginLeft: '-24px' }}>
            <img
              src="/Company Images/semi-icon.png"
              alt="Truck"
              style={{
                width: '48px',
                height: 'auto',
                opacity: 0.8
              }}
            />
          </li>
        </ul>

        {/* Hamburger — display:none above 1024px, so it takes no part in the
            desktop flex row and cannot shift the existing layout. */}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-panel"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(open => !open)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div
        id="nav-mobile-panel"
        className={`nav-mobile-panel${menuOpen ? ' is-open' : ''}`}
      >
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'is-active' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
