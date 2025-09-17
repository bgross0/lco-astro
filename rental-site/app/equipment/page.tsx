'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { MOCK_EQUIPMENT, EQUIPMENT_CATEGORIES, type Equipment } from '@/lib/mockData'

export default function EquipmentPage() {
  // Initialize with mock data to avoid hydration mismatch
  const [equipment] = useState<Equipment[]>(MOCK_EQUIPMENT)
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all')

  // Filter equipment based on category, search, and price
  useEffect(() => {
    let filtered = equipment

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Price filter
    switch (priceRange) {
      case 'budget':
        filtered = filtered.filter(item => item.daily_rate < 100)
        break
      case 'mid':
        filtered = filtered.filter(item => item.daily_rate >= 100 && item.daily_rate < 200)
        break
      case 'premium':
        filtered = filtered.filter(item => item.daily_rate >= 200)
        break
    }

    setFilteredEquipment(filtered)
  }, [selectedCategory, searchTerm, priceRange, equipment])

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="gradient-bg text-white py-12">
          <div className="container-custom">
            <h1 className="text-4xl font-bold mb-4 text-white">Equipment Catalog</h1>
            <p className="text-xl text-blue-50">
              Browse our complete selection of rental equipment
            </p>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="bg-gray-50 border-b">
          <div className="container-custom py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {EQUIPMENT_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-white text-neutral-dark hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Prices</option>
                <option value="budget">Under $100/day</option>
                <option value="mid">$100-200/day</option>
                <option value="premium">$200+/day</option>
              </select>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-neutral-medium">
              Showing {filteredEquipment.length} of {equipment.length} items
            </div>
          </div>
        </section>

        {/* Equipment Grid */}
        <section className="section-padding">
          <div className="container-custom">
            {filteredEquipment.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-neutral-medium">
                  No equipment found matching your criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEquipment.map((item) => (
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
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-neutral-medium mb-3">{item.description}</p>
                      )}

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
                            : 'btn bg-gray-300 text-gray-500'
                        }`}
                      >
                        {item.available ? 'View Details' : 'Check Availability'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}