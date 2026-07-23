// Shared copy that more than one component reads.
//
// Deliberately small. This file used to carry a full set of scaffolding data —
// a services list, three placeholder leadership bios ("John Smith" and friends)
// and a sample phone and address — none of which anything rendered once the
// pages that consumed it were removed. Two images were kept alive on disk purely
// by entries here, so anything added back should have a live consumer.
export const siteContent = {
  company: {
    name: "Best Direct Solutions"
  },

  hero: {
    videoUrl: "/Company Images/hero-video.mp4"
  },

  mission: {
    description: `Our mission is to deliver every load with the discipline, integrity, and unwavering commitment forged through military service. As a veteran-owned flatbed trucking company, we provide safe, reliable, and on-time transportation solutions backed by precision, accountability, and an uncompromising work ethic.

We believe every shipment represents more than freight—it represents a promise. By earning our customers' trust through exceptional service, transparent communication, and dependable performance, we build lasting partnerships that stand the test of time.

From pickup to delivery, we are committed to operational excellence, protecting our customers' cargo, and serving every client with the honor, professionalism, and dedication that define our military heritage.`
  }
}
