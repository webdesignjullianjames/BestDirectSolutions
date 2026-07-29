import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import { VideoSyncProvider } from './context/VideoSyncContext'
import './App.css'

/* Home is imported eagerly and the rest are split out.

   Everything used to land in one bundle, so a visitor to "/" downloaded the
   interactive map (SimpleMap, ~2.5k lines) and the leadership page before the
   hero could paint, despite neither being reachable without a click. Splitting
   at the route boundary is what lets the browser skip them.

   Home stays eager on purpose: it is the landing route for nearly all traffic
   and renders the LCP element, so lazy-loading it would insert a second network
   round trip in front of the one view that can least afford it. It is also a
   ten-line wrapper around Hero, so it costs almost nothing to keep. */
const About = lazy(() => import('./pages/About'))
const Team = lazy(() => import('./pages/Team'))
const Contact = lazy(() => import('./pages/Contact'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))

/* Holds the page's vertical space while a route chunk arrives.
   Deliberately empty rather than a spinner: on a warm connection the chunk
   lands in a few frames, and a spinner that flashes for 80ms reads as jank.
   The min-height keeps the footer from jumping up to meet the nav. */
function RouteFallback() {
  return <div style={{ minHeight: '70vh' }} aria-hidden="true" />
}

function AppContent() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow page-transition" key={location.pathname}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            {/* netlify.toml rewrites every unmatched path to index.html so the
                router can resolve it. Without this catch-all a typo'd or stale
                URL matched no route at all and rendered the header and footer
                around an empty page. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <VideoSyncProvider>
        <AppContent />
      </VideoSyncProvider>
    </BrowserRouter>
  )
}

export default App
