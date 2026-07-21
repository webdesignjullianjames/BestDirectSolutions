import { siteContent } from '../data/siteContent'

export default function ServicesGrid() {
  return (
    <section id="services-section" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-4 text-sm font-semibold tracking-widest text-[#C9A86C]">
          [SECTION: SERVICES]
        </div>

        <h2 className="text-4xl font-bold text-white mb-16 text-center">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteContent.services.map((service, idx) => (
            <div
              key={idx}
              className="bg-[#141414] border border-[#C9A86C] p-8 rounded-lg hover:shadow-2xl hover:shadow-[#C9A86C]/20 transition duration-300"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
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
  )
}
