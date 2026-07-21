import { siteContent } from '../data/siteContent'
import TerritoryMap from '../components/TerritoryMap'

export default function Services() {
  return (
    <div className="bg-[#0A0A0A] text-white">
      {/* PAGE HEADER */}
      <section className="py-20 border-b border-[#C9A86C]">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'The Seasons', serif" }}>Our Services</h1>
          <p className="text-xl text-[#D8D8D8] max-w-3xl">
            Comprehensive flatbed delivery solutions tailored to your needs.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-20 border-b border-[#C9A86C]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteContent.services.map((service, idx) => (
              <div
                key={idx}
                className="bg-[#141414] p-8 rounded border border-[#C9A86C] hover:shadow-lg transition duration-300"
                style={{
                  boxShadow: '0 0 12px rgba(200,168,108,0.1)'
                }}
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-[#F5E6B8] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#D8D8D8] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TERRITORY MAP SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <TerritoryMap />
        </div>
      </section>
    </div>
  )
}
