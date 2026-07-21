export default function TeamGrid() {
  const team = [
    { id: 1, name: '[Team Member Name]', role: '[Job Title]' },
    { id: 2, name: '[Team Member Name]', role: '[Job Title]' },
    { id: 3, name: '[Team Member Name]', role: '[Job Title]' },
  ]

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
        <div className="grid grid-cols-3 gap-8">
          {team.map(member => (
            <div key={member.id} className="text-center">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                [Photo placeholder]
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
