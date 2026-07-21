import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { VideoSyncProvider } from './context/VideoSyncContext'
import './App.css'

function AppContent() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
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
