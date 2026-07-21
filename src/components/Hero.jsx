import { useRef, useEffect, useState } from 'react'
import { siteContent } from '../data/siteContent'
import { useVideoSync } from '../context/VideoSyncContext'

export default function Hero() {
  const videoRef = useRef(null)
  const [textOpacity, setTextOpacity] = useState(1)
  const { setHeroVideoRef } = useVideoSync()

  useEffect(() => {
    setHeroVideoRef(videoRef)
  }, [setHeroVideoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playTimeout = setTimeout(() => {
      video.play().catch(err => console.error('Video play error:', err))
    }, 100)

    const handleVideoEnd = () => {
      video.currentTime = 0
      video.play()
    }

    const handleTimeUpdate = () => {
      const time = video.currentTime
      if (time >= 30 && time < 32) {
        setTextOpacity(1 - (time - 30) / 2)
      } else if (time >= 32) {
        setTextOpacity(0)
      } else {
        setTextOpacity(1)
      }
    }

    video.addEventListener('ended', handleVideoEnd)
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      clearTimeout(playTimeout)
      video.removeEventListener('ended', handleVideoEnd)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  return (
    <section
      id="hero-section"
      className="relative h-screen flex flex-col items-center justify-end overflow-hidden bg-black"
    >
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          // Shown until the first frame paints, and left in place entirely when
          // autoplay is refused — iOS Low Power Mode blocks it regardless of the
          // attributes above, so without this the hero collapses to flat black.
          poster="/Company Images/home-still.png"
          className="w-full h-full object-cover"
        >
          <source src={siteContent.hero.videoUrl} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>

        <div className="absolute inset-0" style={{
          boxShadow: 'inset 0 0 180px rgba(201, 168, 108, 0.2), inset 0 0 80px rgba(201, 168, 108, 0.1)'
        }}></div>
      </div>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 z-10"
        style={{
          opacity: textOpacity,
          transition: 'opacity 0.1s ease-out',
          pointerEvents: textOpacity > 0.1 ? 'auto' : 'none'
        }}
      >

        <div className="mb-2">
          <h1 style={{
            fontFamily: "'The Seasons', serif",
            fontWeight: 600,
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            letterSpacing: '2px',
            color: '#F5E6B8',
            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
            margin: 0
          }}>
            BUILT TO HAUL<br />WHAT OTHERS CANT.
          </h1>
        </div>

        <div style={{
          width: '52px',
          height: '1px',
          background: '#ffffff',
          margin: '10px auto 22px',
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 16px rgba(255, 255, 255, 0.3)'
        }}></div>

        <p style={{
          fontFamily: "'The Seasons', serif",
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.6)',
          margin: '0 0 22px 0',
          animation: 'subtlePulse 3s ease-in-out infinite',
          textShadow: '0 0 6px rgba(255, 255, 255, 0.3), 0 0 12px rgba(255, 255, 255, 0.15)'
        }}>
          LOCAL <span style={{color: '#C8A020'}}>·</span> LONG HAUL <span style={{color: '#C8A020'}}>·</span> SPECIALIZED FREIGHT
        </p>

        <div className="flex gap-3.5 justify-center flex-wrap mb-4">
          <a href="/contact" style={{
            background: '#C8A020',
            color: '#0D0F12',
            fontFamily: "'The Seasons', serif",
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '11px 26px',
            border: 'none',
            borderRadius: 0,
            textDecoration: 'none',
            display: 'inline-block',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#D4B96A'}
          onMouseLeave={(e) => e.target.style.background = '#C8A020'}
          >
            GET A QUOTE →
          </a>

          <a href="/about" style={{
            background: 'transparent',
            color: '#F5E6B8',
            border: '1.5px solid rgba(245,230,184,0.5)',
            fontFamily: "'The Seasons', serif",
            fontWeight: 600,
            fontSize: '0.72rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '10px 26px',
            borderRadius: 0,
            textDecoration: 'none',
            display: 'inline-block',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#C8A020'
            e.target.style.color = '#C8A020'
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(245,230,184,0.5)'
            e.target.style.color = '#F5E6B8'
          }}
          >
            LEARN MORE
          </a>
        </div>

        <p style={{
          fontFamily: "'The Seasons', serif",
          fontWeight: 600,
          fontSize: '0.65rem',
          letterSpacing: '2px',
          color: 'rgba(245,230,184,0.25)',
          marginTop: '16px',
          margin: 0,
          animation: 'subtlePulse 3s ease-in-out infinite'
        }}>
          DOT 4527036
        </p>
      </div>

    </section>
  )
}
