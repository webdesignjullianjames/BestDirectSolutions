import { useState, useEffect } from 'react'

const sections = [
  { id: 'introduction', num: '1.', title: 'Introduction' },
  { id: 'information-we-collect', num: '2.', title: 'Information We Collect' },
  { id: 'how-we-use-your-information', num: '3.', title: 'How We Use Your Information' },
  { id: 'cookies-and-tracking', num: '4.', title: 'Cookies and Tracking Technologies' },
  { id: 'data-security', num: '5.', title: 'Data Security' },
  { id: 'third-party-services', num: '6.', title: 'Third-Party Services' },
  { id: 'legal-compliance', num: '7.', title: 'Legal Compliance' },
  { id: 'your-privacy-rights', num: '8.', title: 'Your Privacy Rights' },
  { id: 'childrens-privacy', num: '9.', title: "Children's Privacy" },
  { id: 'changes-to-this-policy', num: '10.', title: 'Changes to This Privacy Policy' },
  { id: 'contact-us', num: '11.', title: 'Contact Us' }
]

function SectionHeading({ num, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '9px', marginBottom: '10px' }}>
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: '700',
        fontSize: '18px',
        color: '#C8A020'
      }}>{num}</span>
      <h2 style={{
        fontFamily: "'The Seasons', serif",
        fontWeight: '700',
        fontSize: '17px',
        textTransform: 'uppercase',
        color: '#F5F6F7',
        margin: 0,
        letterSpacing: '0.5px'
      }}>{title}</h2>
    </div>
  )
}

function SubHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'The Seasons', serif",
      fontWeight: '700',
      fontSize: '11px',
      color: '#C8A020',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      margin: '12px 0 6px'
    }}>{children}</h3>
  )
}

export default function PrivacyPolicy() {
  const [activeId, setActiveId] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleTocClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div
      className="min-h-screen py-16"
      style={{
        backgroundImage: 'linear-gradient(180deg, rgba(10, 10, 10, 0.45) 0%, rgba(10, 10, 10, 0.6) 40%, rgba(13, 15, 18, 0.8) 100%), url("/Company Images/privay-policy.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <style>{`
        .pp-section {
          scroll-margin-top: 96px;
        }
        .pp-section + .pp-section {
          margin-top: 26px;
        }
        .pp-num {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
        }
        .pp-body {
          font-family: 'The Seasons', serif;
          font-size: 12.5px;
          color: #9AA0A8;
          line-height: 1.8;
          margin: 0;
        }
        .pp-body + .pp-body {
          margin-top: 8px;
        }
        .pp-list {
          list-style: none;
          margin: 8px 0 0 0;
          padding: 0;
        }
        .pp-list li {
          font-family: 'The Seasons', serif;
          position: relative;
          padding-left: 14px;
          font-size: 12px;
          color: #9AA0A8;
          line-height: 1.6;
        }
        .pp-list li + li {
          margin-top: 6px;
        }
        .pp-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 7px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #C8A020;
        }
        .pp-wrap {
          max-width: 920px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .pp-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 18px;
          align-items: start;
        }
        .pp-toc {
          background: #13171C;
          border: 1px solid #252B33;
          border-top: 3px solid #C8A020;
          padding: 16px 14px;
          position: sticky;
          top: 16px;
        }
        .pp-toc-label {
          font-family: 'The Seasons', serif;
          font-weight: 700;
          font-size: 9px;
          color: #8A919A;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 8px 0;
        }
        .pp-toc-link {
          font-family: 'The Seasons', serif;
          display: block;
          font-size: 11px;
          color: #8A919A;
          padding: 5px 0 5px 10px;
          border-left: 2px solid transparent;
          text-decoration: none;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .pp-toc-link:hover {
          color: #C8A020;
          border-left-color: #C8A020;
        }
        .pp-toc-link.active {
          color: #C8A020;
          border-left-color: #C8A020;
          font-weight: 600;
        }
        .pp-panel {
          background: #13171C;
          border: 1px solid #252B33;
          border-top: 3px solid #C8A020;
          padding: 26px 28px;
        }
        @media (max-width: 700px) {
          .pp-grid {
            grid-template-columns: 1fr;
          }
          .pp-toc {
            position: static;
          }
          .pp-toc-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 2px 14px;
          }
          .pp-toc-link {
            border-left: none;
            padding-left: 0;
          }
          .pp-toc-link:hover,
          .pp-toc-link.active {
            border-left: none;
          }
        }
      `}</style>

      <div className="pp-wrap">
      {/* PAGE HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <p style={{
          fontFamily: "'The Seasons', serif",
          fontWeight: '700',
          fontSize: '10px',
          color: '#C8A020',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          margin: '0 0 8px 0'
        }}>
          LEGAL
        </p>
        <h1 style={{
          fontFamily: "'The Seasons', serif",
          fontWeight: '800',
          fontSize: '30px',
          textTransform: 'uppercase',
          color: '#F5F6F7',
          margin: 0,
          letterSpacing: '0.5px'
        }}>
          PRIVACY <span style={{ color: '#C8A020' }}>POLICY</span>
        </h1>
        <div style={{
          width: '48px',
          height: '3px',
          backgroundColor: '#C8A020',
          margin: '10px auto'
        }}></div>
        <p style={{
          fontFamily: "'The Seasons', serif",
          fontSize: '11px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#8A919A',
          margin: 0
        }}>
          Last Updated: <span style={{ color: '#C8A020' }}>July <span className="pp-num">2026</span></span>
        </p>
      </div>

      <div className="pp-grid">
        {/* STICKY TABLE OF CONTENTS */}
        <aside className="pp-toc">
          <p className="pp-toc-label">ON THIS PAGE</p>
          <nav className="pp-toc-nav">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`pp-toc-link${activeId === s.id ? ' active' : ''}`}
                onClick={(e) => handleTocClick(e, s.id)}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* READING PANEL */}
        <div className="pp-panel">
          <section id="introduction" className="pp-section">
            <SectionHeading num="1." title="Introduction" />
            <p className="pp-body">
              Best Direct Solutions ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section id="information-we-collect" className="pp-section">
            <SectionHeading num="2." title="Information We Collect" />
            <SubHeading>Personal Information</SubHeading>
            <p className="pp-body">
              We may collect personal information that you voluntarily provide, including but not limited to:
            </p>
            <ul className="pp-list">
              <li>Name and contact information (email, phone number, address)</li>
              <li>Company information</li>
              <li>Billing and shipping information</li>
              <li>Service preferences and requirements</li>
            </ul>
            <SubHeading>Automatically Collected Information</SubHeading>
            <p className="pp-body">
              When you visit our website, we may automatically collect certain information about your device and browsing behavior, including:
            </p>
            <ul className="pp-list">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website or search terms used</li>
            </ul>
          </section>

          <section id="how-we-use-your-information" className="pp-section">
            <SectionHeading num="3." title="How We Use Your Information" />
            <p className="pp-body">We use the information we collect for various purposes, including:</p>
            <ul className="pp-list">
              <li>Providing and improving our services</li>
              <li>Processing quotes and service requests</li>
              <li>Sending administrative and transactional communications</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Analyzing website usage and trends</li>
              <li>Preventing fraudulent activities and enhancing security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section id="cookies-and-tracking" className="pp-section">
            <SectionHeading num="4." title="Cookies and Tracking Technologies" />
            <p className="pp-body">
              Our website uses cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Please note that disabling cookies may affect website functionality.
            </p>
          </section>

          <section id="data-security" className="pp-section">
            <SectionHeading num="5." title="Data Security" />
            <p className="pp-body">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is <span className="pp-num">100%</span> secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section id="third-party-services" className="pp-section">
            <SectionHeading num="6." title="Third-Party Services" />
            <p className="pp-body">
              We may share your information with third-party service providers who assist us in operating our website and conducting our business, including payment processors, hosting providers, and analytics services. These third parties are contractually obligated to use your information only to provide services to us and are required to maintain the confidentiality of your information.
            </p>
          </section>

          <section id="legal-compliance" className="pp-section">
            <SectionHeading num="7." title="Legal Compliance" />
            <p className="pp-body">
              We may disclose your information when required by law or in response to legal process, such as a court order or subpoena. We may also disclose information to protect the safety, rights, and property of Best Direct Solutions, our customers, and the public.
            </p>
          </section>

          <section id="your-privacy-rights" className="pp-section">
            <SectionHeading num="8." title="Your Privacy Rights" />
            <p className="pp-body">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="pp-list">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to opt-out of marketing communications</li>
            </ul>
            <p className="pp-body" style={{ marginTop: '8px' }}>
              To exercise these rights, please contact us using the information provided in the Contact section below.
            </p>
          </section>

          <section id="childrens-privacy" className="pp-section">
            <SectionHeading num="9." title="Children's Privacy" />
            <p className="pp-body">
              Our website and services are not directed to children under the age of <span className="pp-num">13</span>. We do not knowingly collect personal information from children under <span className="pp-num">13</span>. If we become aware that we have collected information from a child under <span className="pp-num">13</span>, we will take steps to delete such information promptly.
            </p>
          </section>

          <section id="changes-to-this-policy" className="pp-section">
            <SectionHeading num="10." title="Changes to This Privacy Policy" />
            <p className="pp-body">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, and other factors. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date below.
            </p>
          </section>

          <section id="contact-us" className="pp-section">
            <SectionHeading num="11." title="Contact Us" />
            <p className="pp-body">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div style={{
              marginTop: '12px',
              background: '#0D0F12',
              border: '1px solid #252B33',
              borderTop: '3px solid #C8A020',
              padding: '16px 18px'
            }}>
              <p style={{
                fontFamily: "'The Seasons', serif",
                fontWeight: '800',
                fontSize: '15px',
                color: '#FFFFFF',
                margin: '0 0 4px 0'
              }}>
                Best Direct Solutions
              </p>
              <p style={{ fontFamily: "'The Seasons', serif", fontSize: '12px', color: '#9AA0A8', lineHeight: '1.9', margin: 0 }}>
                Email: <a href="mailto:info@bestsolutions4you.com" style={{ color: '#C8A020', textDecoration: 'none', fontFamily: "'Rajdhani', sans-serif", fontWeight: '600' }}>info@bestsolutions4you.com</a>
              </p>
              <p style={{ fontFamily: "'The Seasons', serif", fontSize: '12px', color: '#9AA0A8', lineHeight: '1.9', margin: 0 }}>
                Address: <span className="pp-num">7411</span> Barlite Blvd, San Antonio TX, P.O. Box <span className="pp-num">240278</span>
              </p>
            </div>
          </section>
        </div>
      </div>
      </div>
    </div>
  )
}
