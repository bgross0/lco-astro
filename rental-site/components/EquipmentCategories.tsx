import Link from 'next/link'

const categories = [
  {
    name: 'Snow Removal',
    icon: '❄️',
    description: 'Snow blowers, plows, salt spreaders',
    link: '/equipment/snow-removal',
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'Lawn Care',
    icon: '🌱',
    description: 'Mowers, trimmers, aerators',
    link: '/equipment/lawn-care',
    color: 'from-green-400 to-green-600',
  },
  {
    name: 'Landscaping',
    icon: '🌳',
    description: 'Tillers, edgers, leaf blowers',
    link: '/equipment/landscaping',
    color: 'from-accent to-accent-dark',
  },
  {
    name: 'Heavy Equipment',
    icon: '🚜',
    description: 'Mini excavators, skid steers',
    link: '/equipment/heavy-equipment',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'Power Tools',
    icon: '🔧',
    description: 'Chainsaws, generators, compressors',
    link: '/equipment/power-tools',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Seasonal',
    icon: '📅',
    description: 'Holiday lights, decorations',
    link: '/equipment/seasonal',
    color: 'from-red-400 to-pink-500',
  },
]

export default function EquipmentCategories() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Equipment Categories</h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Find the right tools for your project. All equipment is professionally maintained and ready to work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group card hover:scale-105 transform transition-all duration-300"
            >
              <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <span className="text-6xl">{category.icon}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-neutral-medium">{category.description}</p>
                <div className="mt-4 text-primary font-semibold flex items-center">
                  Browse {category.name}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}