import { Link, useLocation } from 'react-router-dom'
import { siteContent } from '../data/siteContent'
import { useRef, useEffect, useState } from 'react'
import { useVideoSync } from '../context/VideoSyncContext'

export default function Footer() {
  const year = new Date().getFullYear()
  // Which footer group is expanded on mobile. Null means all collapsed, which
  // is the initial state — the point of the accordion is a short footer.
  // Ignored entirely at desktop width, where every group renders open.
  const [openGroup, setOpenGroup] = useState(null)
  // Whether the footer body (logo + link groups) is revealed on mobile. Closed
  // initially, so the footer costs nothing but the rule and the copyright line
  // until someone asks for it. Has no effect at desktop width.
  const [footerOpen, setFooterOpen] = useState(false)
  const toggleGroup = (id) => setOpenGroup(current => (current === id ? null : id))
  const videoRef = useRef(null)
  const { heroVideoRef } = useVideoSync()
  const location = useLocation()

  // Determine which video to use based on current page
  const getVideoUrl = () => {
    switch(location.pathname) {
      case '/about':
        return '/Company Images/territory-loop.mp4'
      case '/contact':
        return '/Company Images/contact-page-loop.mp4'
      case '/team':
        return siteContent.hero.videoUrl
      default:
        return siteContent.hero.videoUrl
    }
  }

  // Fallback still for each page, shown until the first frame paints and left up
  // permanently when autoplay is refused (iOS Low Power Mode). Deliberately its own
  // switch rather than a lookup keyed off videoUrl: /team and / share the hero
  // video but take different stills, so the mapping is not one-to-one.
  const getPosterUrl = () => {
    switch(location.pathname) {
      case '/about':
        return '/Company Images/territory-still.png'
      case '/contact':
        return '/Company Images/territory-background.jpg'
      case '/team':
        return '/Company Images/generic-truck-bg.jpg'
      default:
        return '/Company Images/home-still.png'
    }
  }

  const videoUrl = getVideoUrl()
  const posterUrl = getPosterUrl()

  useEffect(() => {
    const footerVideo = videoRef.current
    if (!footerVideo) return

    // Reset video when source changes
    footerVideo.currentTime = 0

    // Both timers are tracked so the cleanup below can cancel them. Navigating
    // away inside the first 600ms otherwise left a play() call queued against a
    // video whose source was about to be swapped, which surfaced as a spurious
    // AbortError in the console on fast page changes.
    let retryTimer

    const playVideo = async () => {
      try {
        await footerVideo.play()
      } catch (err) {
        console.error('Footer video autoplay error:', err)
        retryTimer = setTimeout(() => {
          footerVideo.play().catch(e => console.error('Footer video retry error:', e))
        }, 500)
      }
    }

    // Small delay to ensure video element is ready
    const startTimer = setTimeout(playVideo, 100)

    const clearTimers = () => {
      clearTimeout(startTimer)
      clearTimeout(retryTimer)
    }

    // If there's no Hero video (different page), just play independently
    if (!heroVideoRef?.current) {
      return clearTimers
    }

    // If there is a Hero video, sync with it
    const heroVideo = heroVideoRef.current

    // Sync by trimming playback speed, not by seeking.
    //
    // This previously assigned currentTime whenever drift exceeded 0.1s. But
    // timeupdate fires roughly 4x a second, and normal drift between two
    // independently-decoded videos exceeds 0.1s within that window nearly every
    // time — so it seeked constantly. Every currentTime assignment flushes the
    // decoder and re-decodes from the nearest keyframe, so the footer video was
    // being restarted several times a second and never played cleanly. It read
    // as running slow.
    //
    // Now: ignore drift inside the deadband, correct small drift by nudging
    // playbackRate a few percent so it converges invisibly, and only fall back
    // to a hard seek when something has gone genuinely out of step — a loop
    // boundary, a tab returning from background.
    const DEADBAND = 0.08
    const HARD_RESYNC = 0.5

    const syncVideos = () => {
      const drift = footerVideo.currentTime - heroVideo.currentTime
      const magnitude = Math.abs(drift)

      if (magnitude > HARD_RESYNC) {
        footerVideo.currentTime = heroVideo.currentTime
        footerVideo.playbackRate = 1
      } else if (magnitude > DEADBAND) {
        // Ahead of the hero: ease off. Behind it: run slightly hot.
        footerVideo.playbackRate = drift > 0 ? 0.97 : 1.03
      } else if (footerVideo.playbackRate !== 1) {
        footerVideo.playbackRate = 1
      }

      if (heroVideo.paused) {
        footerVideo.pause()
      } else if (footerVideo.paused) {
        footerVideo.play().catch(err => console.error('Footer video sync play error:', err))
      }
    }

    heroVideo.addEventListener('play', syncVideos)
    heroVideo.addEventListener('pause', syncVideos)
    heroVideo.addEventListener('timeupdate', syncVideos)

    return () => {
      clearTimers()
      heroVideo.removeEventListener('play', syncVideos)
      heroVideo.removeEventListener('pause', syncVideos)
      heroVideo.removeEventListener('timeupdate', syncVideos)
      // Leave the element at normal speed — otherwise a trim applied on the
      // last tick before navigation persists into the next page's footer.
      footerVideo.playbackRate = 1
    }
  }, [heroVideoRef, location])

  return (
    <footer className="text-white border-t border-[#C9A86C]" style={{
      backgroundColor: '#13171C',
      position: 'relative',
      overflow: 'hidden',
      marginTop: 0
    }}>
      <style>{`
        @keyframes smoothLoopFade {
          0% { opacity: 0.55; }
          92% { opacity: 0.55; }
          96% { opacity: 0.45; }
          100% { opacity: 0.55; }
        }
        .territory-footer-video {
          animation: smoothLoopFade 0.1s linear;
        }

        /* ------------------------------------------------------------------
           MOBILE FOOTER ACCORDION.

           Desktop renders exactly as before: the toggle button is display:none
           at base, so it never enters the layout, and .footer-group-body has
           no base rule so the links are always visible. Everything that
           collapses lives inside the media query below.

           Collapsed by default — three ~48px header rows instead of three
           full link lists, which is the whole point.
           ------------------------------------------------------------------ */
        .footer-group-toggle { display: none; }
        .footer-copy-toggle { display: none; }

        @media (max-width: 767px) {
          /* Resting footer on mobile is just the rule and the copyright. The
             logo and all three link groups stay out of the layout until asked
             for — the footer repeats on every page, so it should not cost a
             screenful of scrolling by default. */
          .footer-main { display: none; }
          .footer-main.is-open { display: flex; }

          /* No rule above the copyright on mobile. With the footer body hidden
             there is nothing for it to divide, so it just reads as a stray
             line across the bottom of every page. Its padding goes with it. */
          .footer-bottom {
            border-top: none !important;
            padding-top: 0 !important;
          }

          .footer-copy-static { display: none; }
          .footer-copy-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 2px 0 4px;
            background: none;
            border: none;
            cursor: pointer;
            font-family: 'The Seasons', serif;
            font-size: 11.5px;
            color: #D8D8D8;
            text-align: center;
          }
          /* Chevron points UP when closed — the content it reveals is above
             the line, not below it. */
          .footer-copy-toggle::after {
            content: '';
            width: 7px;
            height: 7px;
            flex-shrink: 0;
            border-right: 2px solid #C9A86C;
            border-bottom: 2px solid #C9A86C;
            transform: translateY(2px) rotate(-135deg);
            transition: transform 0.25s ease;
          }
          .footer-copy-toggle[aria-expanded="true"]::after {
            transform: translateY(-2px) rotate(45deg);
          }
          .footer-group {
            border-bottom: 1px solid rgba(201, 168, 108, 0.18);
          }
          .footer-group:first-child {
            border-top: 1px solid rgba(201, 168, 108, 0.18);
          }
          /* The desktop heading is replaced by the button, which carries the
             same label and doubles as the tap target. */
          .footer-group-title { display: none; }

          .footer-group-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 15px 2px;
            background: none;
            border: none;
            cursor: pointer;
            font-family: 'The Seasons', serif;
            font-weight: 700;
            font-size: 15px;
            color: #ffffff;
            text-align: left;
          }
          /* Chevron drawn from borders so it needs no asset. Points down when
             collapsed, flips up when open. */
          .footer-group-toggle::after {
            content: '';
            width: 8px;
            height: 8px;
            margin-right: 4px;
            border-right: 2px solid #C9A86C;
            border-bottom: 2px solid #C9A86C;
            transform: translateY(-2px) rotate(45deg);
            transition: transform 0.25s ease;
          }
          .footer-group-toggle[aria-expanded="true"]::after {
            transform: translateY(2px) rotate(-135deg);
          }

          .footer-group-body { display: none; padding-bottom: 15px; }
          .footer-group-body.is-open { display: block; }
        }
      `}</style>

      {/* Page-Specific Video Background */}
      <video
        key={videoUrl}
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
        className={location.pathname === '/about' ? 'territory-footer-video' : ''}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: location.pathname === '/about' ? 0.55 : 0.15,
          pointerEvents: 'none'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-6 py-6 md:py-10">
        {/* Stacks below 768px: the logo is h-32 (128px) and sat beside three
            link columns in a row that never wrapped, squeezing them to nothing
            on a phone. md: and above keeps the original row and gap, so desktop
            is unchanged. */}
        <div id="footer-main" className={`footer-main flex flex-col md:flex-row gap-5 md:gap-16 items-start mb-6 md:mb-8${footerOpen ? ' is-open' : ''}`}>
          {/* LOGO */}
          <div className="flex-shrink-0">
            <img
              src="/Company Images/platinum-logo-alt.png"
              alt="Best Direct Solutions Logo"
              className="h-20 md:h-32 w-auto object-contain"
            />
          </div>

          {/* CONTENT - SERVICES, COMPANY, CONTACT
              Single column on phones, where each group collapses to a tappable
              header row. gap-0 there because the group borders do the dividing;
              md: and up restores the original three-column row and gap-12. */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-12 w-full md:w-auto">
          {/* QUICK LINKS */}
          <div className="footer-group">
            <h3 className="footer-group-title" style={{ fontFamily: "'The Seasons', serif", fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '16px' }}>Services</h3>
            <button
              type="button"
              className="footer-group-toggle"
              aria-expanded={openGroup === 'services'}
              aria-controls="footer-group-services"
              onClick={() => toggleGroup('services')}
            >
              Services
            </button>
            <div id="footer-group-services" className={`footer-group-body${openGroup === 'services' ? ' is-open' : ''}`}>
              <ul className="text-sm text-[#D8D8D8] space-y-2" style={{ fontFamily: "'The Seasons', serif" }}>
                <li><Link to="/about#freight-solutions" className="hover:text-[#C9A86C] transition">Flatbed Delivery</Link></li>
                <li><Link to="/about#freight-solutions" className="hover:text-[#C9A86C] transition">Specialized Transport</Link></li>
                <li><Link to="/contact" className="hover:text-[#C9A86C] transition">24/7 Support</Link></li>
                <li><Link to="/about#services-section" className="hover:text-[#C9A86C] transition">Nationwide Coverage</Link></li>
              </ul>
            </div>
          </div>

          {/* COMPANY */}
          <div className="footer-group">
            <h3 className="footer-group-title" style={{ fontFamily: "'The Seasons', serif", fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '16px' }}>Company</h3>
            <button
              type="button"
              className="footer-group-toggle"
              aria-expanded={openGroup === 'company'}
              aria-controls="footer-group-company"
              onClick={() => toggleGroup('company')}
            >
              Company
            </button>
            <div id="footer-group-company" className={`footer-group-body${openGroup === 'company' ? ' is-open' : ''}`}>
              <ul className="text-sm text-[#D8D8D8] space-y-2" style={{ fontFamily: "'The Seasons', serif" }}>
                <li><Link to="/about" className="hover:text-[#C9A86C] transition">About Us</Link></li>
                <li><Link to="/team" className="hover:text-[#C9A86C] transition">Leadership</Link></li>
                <li><Link to="/contact" className="hover:text-[#C9A86C] transition">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-[#C9A86C] transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="footer-group">
            <h3 className="footer-group-title" style={{ fontFamily: "'The Seasons', serif", fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '16px' }}>Contact</h3>
            <button
              type="button"
              className="footer-group-toggle"
              aria-expanded={openGroup === 'contact'}
              aria-controls="footer-group-contact"
              onClick={() => toggleGroup('contact')}
            >
              Contact
            </button>
            <div id="footer-group-contact" className={`footer-group-body${openGroup === 'contact' ? ' is-open' : ''}`}>
              <p className="text-[#D8D8D8] text-sm mb-2" style={{ fontFamily: "'The Seasons', serif" }}>
                <span style={{ display: 'block', fontWeight: '600', color: '#ffffff' }}>Phone</span>
                Coming Soon
              </p>
              <p className="text-[#D8D8D8] text-sm mb-2" style={{ fontFamily: "'The Seasons', serif" }}>
                <span style={{ display: 'block', fontWeight: '600', color: '#ffffff' }}>Email</span>
                <a href="mailto:info@bestsolutions4you.com" className="hover:text-[#C9A86C] transition" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: '600' }}>info@bestsolutions4you.com</a>
              </p>
              <p className="text-[#D8D8D8] text-sm" style={{ fontFamily: "'The Seasons', serif" }}>
                <span style={{ display: 'block', fontWeight: '600', color: '#ffffff' }}>Address</span>
                7411 Barlite Blvd, San Antonio TX<br/>P.O. Box 240278
              </p>
            </div>
          </div>
          </div>
        </div>

        {/* DIVIDER — on mobile this line and the copyright are the entire
            resting footer; the copyright doubles as the control that reveals
            everything above it. */}
        <div className="footer-bottom border-t border-[#C9A86C] pt-6">
          <p className="footer-copy-static text-center text-[#D8D8D8] text-sm" style={{ fontFamily: "'The Seasons', serif" }}>
            &copy; {year} {siteContent.company.name}. All rights reserved.
          </p>
          <button
            type="button"
            className="footer-copy-toggle"
            aria-expanded={footerOpen}
            aria-controls="footer-main"
            onClick={() => setFooterOpen(open => !open)}
          >
            <span>&copy; {year} {siteContent.company.name}. All rights reserved.</span>
          </button>
        </div>
      </div>
      </div>
    </footer>
  )
}
