import { Link } from 'react-router-dom'

export default function Nav() {
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
      `}</style>
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center relative z-10">
        {/* LOGO + HOME */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex-shrink-0 -ml-80">
            <img
              src="/Company Images/platinum-logo-alt.png"
              alt="Best Direct Solutions"
              className="h-20 w-auto object-contain"
            />
          </Link>
          {/* DIVIDER */}
          <div style={{
            width: '1px',
            height: '32px',
            backgroundColor: '#8B6F47',
            opacity: 0.5
          }}></div>
          <Link
            to="/"
            className="text-[#8B6F47] font-semibold hover:text-[#A68060] transition border-b-2 border-transparent hover:border-[#A68060] nav-link-glow"
            style={{
              fontFamily: "'The Seasons', serif"
            }}
          >
            HOME
          </Link>
        </div>

        {/* CENTER MENU */}
        <ul className="flex gap-12 items-center">
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
      </div>
    </nav>
  )
}
