import Link from 'next/link'
import Image from 'next/image'
import { FEATURED_EQUIPMENT, type Equipment } from '@/lib/mockData'

export default function FeaturedEquipment() {
  // Use static data - no useState or useEffect to avoid hydration mismatches
  const equipment = FEATURED_EQUIPMENT

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Equipment</h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Popular rentals for current season. Book early to ensure availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipment.map((item) => (
            <div key={item.id} className="card group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-4xl">🔧</span>
                  </div>
                )}
                {!item.available && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Rented Out
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm text-primary font-semibold mb-1">{item.category}</p>
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>

                <div className="space-y-1 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-medium">Hourly:</span>
                    <span className="font-semibold">${item.hourly_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-medium">Daily:</span>
                    <span className="font-semibold">${item.daily_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-medium">Weekly:</span>
                    <span className="font-semibold">${item.weekly_rate}</span>
                  </div>
                </div>

                <Link
                  href={`/equipment/${item.id}`}
                  className={`w-full text-center ${
                    item.available
                      ? 'btn btn-primary'
                      : 'btn bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.available ? 'View Details' : 'Check Availability'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/equipment" className="btn btn-outline">
            View All Equipment
          </Link>
        </div>
      </div>
    </section>
  )
}