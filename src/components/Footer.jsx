import { Link, useLocation } from 'react-router-dom'
import { siteContent } from '../data/siteContent'
import { useRef, useEffect } from 'react'
import { useVideoSync } from '../context/VideoSyncContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const videoRef = useRef(null)
  const { heroVideoRef } = useVideoSync()
  const location = useLocation()

  // Determine which video to use based on current page
  const getVideoUrl = () => {
    switch(location.pathname) {
      case '/about':
        return '/Company Images/territory_loop.mp4'
      case '/contact':
        return '/Company Images/contact-page-loading.mp4'
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

    // Attempt to play the video
    const playVideo = async () => {
      try {
        await footerVideo.play()
      } catch (err) {
        console.error('Footer video autoplay error:', err)
        // Retry after a short delay
        setTimeout(() => {
          footerVideo.play().catch(e => console.error('Footer video retry error:', e))
        }, 500)
      }
    }

    // Small delay to ensure video element is ready
    setTimeout(playVideo, 100)

    // If there's no Hero video (different page), just play independently
    if (!heroVideoRef?.current) {
      return
    }

    // If there is a Hero video, sync with it
    const heroVideo = heroVideoRef.current

    const syncVideos = () => {
      if (Math.abs(footerVideo.currentTime - heroVideo.currentTime) > 0.1) {
        footerVideo.currentTime = heroVideo.currentTime
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
      heroVideo.removeEventListener('play', syncVideos)
      heroVideo.removeEventListener('pause', syncVideos)
      heroVideo.removeEventListener('timeupdate', syncVideos)
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
        <div className="flex flex-col md:flex-row gap-5 md:gap-16 items-start mb-6 md:mb-8">
          {/* LOGO */}
          <div className="flex-shrink-0">
            <img
              src="/Company Images/platinum-logo-alt.png"
              alt="Best Direct Solutions Logo"
              className="h-20 md:h-32 w-auto object-contain"
            />
          </div>

          {/* CONTENT - SERVICES, COMPANY, CONTACT */}
          {/* Two-up on phones rather than single-file. Stacked, the three link
              groups plus the logo made four full-height blocks and the footer
              ran longer than most of the pages above it. md: and up is the
              original three-column row. */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 md:gap-12 w-full md:w-auto">
          {/* QUICK LINKS */}
          <div>
            <h3 style={{ fontFamily: "'The Seasons', serif", fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '16px' }}>Services</h3>
            <ul className="text-sm text-[#D8D8D8] space-y-2" style={{ fontFamily: "'The Seasons', serif" }}>
              <li><Link to="/about#freight-solutions" className="hover:text-[#C9A86C] transition">Flatbed Delivery</Link></li>
              <li><Link to="/about#freight-solutions" className="hover:text-[#C9A86C] transition">Specialized Transport</Link></li>
              <li><Link to="/contact" className="hover:text-[#C9A86C] transition" style={{ fontFamily: "Barlow, 'Arial', sans-serif" }}>24/7 Support</Link></li>
              <li><Link to="/about#services-section" className="hover:text-[#C9A86C] transition">Nationwide Coverage</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 style={{ fontFamily: "'The Seasons', serif", fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '16px' }}>Company</h3>
            <ul className="text-sm text-[#D8D8D8] space-y-2" style={{ fontFamily: "'The Seasons', serif" }}>
              <li><Link to="/about" className="hover:text-[#C9A86C] transition">About Us</Link></li>
              <li><Link to="/team" className="hover:text-[#C9A86C] transition">Leadership</Link></li>
              <li><Link to="/contact" className="hover:text-[#C9A86C] transition">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-[#C9A86C] transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* CONTACT INFO — spans the full width on the two-up phone grid so
              the address is not squeezed into a half-width third cell. */}
          <div className="col-span-2 md:col-span-1">
            <h3 style={{ fontFamily: "'The Seasons', serif", fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '16px' }}>Contact</h3>
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

        {/* DIVIDER */}
        <div className="border-t border-[#C9A86C] pt-6">
          <p className="text-center text-[#D8D8D8] text-sm" style={{ fontFamily: "'The Seasons', serif" }}>
            &copy; {year} {siteContent.company.name}. All rights reserved.
          </p>
        </div>
      </div>
      </div>
    </footer>
  )
}
