export default function LogisticsPipeline() {
  return (
    <div className="py-16 border-t border-[#C9A86C]">
      {/* TITLE */}
      <h2 className="text-center mb-12" style={{
        fontFamily: "'The Seasons', serif",
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#C9A86C',
        letterSpacing: '2px'
      }}>
        LOGISTICS PIPELINE
      </h2>

      {/* PIPELINE STAGES */}
      <div className="flex justify-between items-start gap-4 max-w-6xl mx-auto px-6">
        {/* STAGE 1: CONFIRMATION/SCHEDULING */}
        <div className="flex-1 text-center">
          <div className="mb-6 flex justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="15" y="10" width="30" height="40" stroke="#C9A86C" strokeWidth="2" rx="2"/>
              <circle cx="25" cy="25" r="3" fill="#C9A86C"/>
              <circle cx="35" cy="25" r="3" fill="#C9A86C"/>
              <path d="M20 35 L25 40 L35 30" stroke="#C9A86C" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h3 className="text-[#C9A86C] font-semibold mb-2" style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '16px',
            letterSpacing: '1px'
          }}>
            CONFIRMATION / SCHEDULING
          </h3>
          <p className="text-[#999999] text-sm">
            Your order is verified and a pickup date is scheduled!
          </p>
        </div>

        {/* ARROW */}
        <div className="flex items-center justify-center pt-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#C9A86C" strokeWidth="2"/>
            <polyline points="30,15 25,20 30,25" stroke="#C9A86C" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* STAGE 2: PICKUP */}
        <div className="flex-1 text-center">
          <div className="mb-6 flex justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="8" y="20" width="44" height="25" stroke="#C9A86C" strokeWidth="2" rx="2"/>
              <rect x="15" y="15" width="30" height="8" stroke="#C9A86C" strokeWidth="2"/>
              <circle cx="18" cy="50" r="3" fill="#C9A86C"/>
              <circle cx="42" cy="50" r="3" fill="#C9A86C"/>
            </svg>
          </div>
          <h3 className="text-[#C9A86C] font-semibold mb-2" style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '16px',
            letterSpacing: '1px'
          }}>
            PICKUP
          </h3>
          <p className="text-[#999999] text-sm">
            Secure collection of your goods by our transport team.
          </p>
        </div>

        {/* ARROW */}
        <div className="flex items-center justify-center pt-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#C9A86C" strokeWidth="2"/>
            <polyline points="30,15 25,20 30,25" stroke="#C9A86C" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* STAGE 3: TRACKING INFORMATION PROVIDED */}
        <div className="flex-1 text-center">
          <div className="mb-6 flex justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="18" y="10" width="24" height="40" stroke="#C9A86C" strokeWidth="2" rx="2"/>
              <circle cx="30" cy="28" r="8" stroke="#C9A86C" strokeWidth="2" fill="none"/>
              <path d="M30 18 L30 12 M30 44 L30 50 M18 28 L12 28 M48 28 L54 28" stroke="#C9A86C" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="text-[#C9A86C] font-semibold mb-2" style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '16px',
            letterSpacing: '1px'
          }}>
            TRACKING INFORMATION PROVIDED
          </h3>
          <p className="text-[#999999] text-sm">
            Real-time tracking details and updates sent directly to you.
          </p>
        </div>

        {/* ARROW */}
        <div className="flex items-center justify-center pt-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#C9A86C" strokeWidth="2"/>
            <polyline points="30,15 25,20 30,25" stroke="#C9A86C" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* STAGE 4: DELIVERY */}
        <div className="flex-1 text-center">
          <div className="mb-6 flex justify-center">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="12" y="20" width="36" height="28" stroke="#C9A86C" strokeWidth="2" rx="2"/>
              <path d="M20 48 L20 55 M40 48 L40 55" stroke="#C9A86C" strokeWidth="2"/>
              <path d="M18 35 L30 25 L42 35" stroke="#C9A86C" strokeWidth="2" fill="none"/>
              <circle cx="35" cy="45" r="2" fill="#C9A86C"/>
            </svg>
          </div>
          <h3 className="text-[#C9A86C] font-semibold mb-2" style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '16px',
            letterSpacing: '1px'
          }}>
            DELIVERY
          </h3>
          <p className="text-[#999999] text-sm">
            Final all-acquisition of your cargo. Confirmation sent directly to you.
          </p>
        </div>
      </div>
    </div>
  )
}
