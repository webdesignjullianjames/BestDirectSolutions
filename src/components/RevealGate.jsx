// The control that stands in for content held back until a visitor asks for
// it: the name of what comes next, flanked by gold rules, above a bouncing
// chevron.
//
// Styles live in src/index.css rather than here — two pages render this, and
// a <style> block inside the component would ship a duplicate copy per
// instance.
//
// Deliberately not a scroll lock: scrolling behaves normally throughout and
// the page simply ends at the gate. Blocking the wheel would fight the
// browser for no real gain, and loses outright on iOS.
export default function RevealGate({
  label,
  controls,
  onReveal,
  background,
  className = '',
  padding = '0 24px 30px'
}) {
  return (
    <section
      className={className}
      style={{ background, padding, textAlign: 'center' }}
    >
      <button
        type="button"
        onClick={onReveal}
        aria-expanded="false"
        aria-controls={controls}
        className="reveal-gate"
      >
        <span className="reveal-gate-divider">
          <span className="reveal-gate-line" aria-hidden="true"></span>
          <span className="reveal-gate-label">{label}</span>
          <span className="reveal-gate-line" aria-hidden="true"></span>
        </span>
        {/* With no box around it, this is the only thing marking the divider
            as something to press rather than a static section header. */}
        <svg
          className="reveal-gate-chevron"
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </section>
  )
}
