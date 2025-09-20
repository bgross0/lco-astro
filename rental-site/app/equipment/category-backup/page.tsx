'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useEquipment } from '@/lib/hooks/useEquipment'
import { useRealtimeUpdates } from '@/lib/hooks/useRealtimeUpdates'
import { vehicleToEquipment } from '@/lib/api/equipment'
import type { VehicleFilters } from '@/lib/types/api'

// Map URL slugs to API category values
const URL_TO_API_CATEGORY: Record<string, string> = {
  'skid-steers': 'skidsteer',
  'excavators': 'excavator',
  'trailers': 'trailer',
  'power-tools': 'power_tool',
  'loaders': 'loader',
  'attachments': 'attachment',
}

// Map URL slugs to display names
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'skid-steers': 'Skid Steers',
  'excavators': 'Excavators',
  'trailers': 'Trailers',
  'power-tools': 'Power Tools',
  'loaders': 'Loaders',
  'attachments': 'Attachments',
}

// Category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'skid-steers': 'Compact track and wheel loaders for construction and landscaping',
  'excavators': 'Mini and compact excavators for digging and earthwork',
  'trailers': 'Equipment and dump trailers for hauling',
  'power-tools': 'Professional chainsaws, generators, and compressors',
  'loaders': 'Wheel loaders and backhoes for heavy lifting',
  'attachments': 'Grapples, buckets, and specialized attachments',
}

export default function CategoryEquipmentPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all')

  // Validate category slug
  const apiCategory = URL_TO_API_CATEGORY[categorySlug]
  const displayName = CATEGORY_DISPLAY_NAMES[categorySlug]
  const description = CATEGORY_DESCRIPTIONS[categorySlug]

  // If invalid category, show 404
  useEffect(() => {
    if (!apiCategory) {
      notFound()
    }
  }, [apiCategory])

  // Build filters for API
  const filters: VehicleFilters = {
    listing_type: 'rental',
    limit: 50,
  }

  // Add price filter
  switch (priceRange) {
    case 'budget':
      filters.max_price = 99
      break
    case 'mid':
      filters.min_price = 100
      filters.max_price = 199
      break
    case 'premium':
      filters.min_price = 200
      break
  }

  // Fetch all equipment
  const { equipment: vehicles, isLoading, isError, refresh } = useEquipment(filters)

  // Connect to real-time updates
  const { connected } = useRealtimeUpdates()

  // Convert vehicles to equipment format
  const allEquipment = vehicles.map(vehicleToEquipment)

  // Filter by category (using API category field directly)
  const categoryEquipment = vehicles
    .filter(vehicle => vehicle.category === apiCategory)
    .map(vehicleToEquipment)

  // Apply search filter
  const filteredEquipment = categoryEquipment.filter(item => {
    if (searchTerm && searchTerm.length > 0) {
      const search = searchTerm.toLowerCase()
      const nameMatch = item.name && typeof item.name === 'string' && item.name.toLowerCase().includes(search)
      const descMatch = item.description && typeof item.description === 'string' && item.description.toLowerCase().includes(search)

      if (!nameMatch && !descMatch) {
        return false
      }
    }
    return true
  })

  if (!apiCategory) {
    return null // Will be handled by notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-6 py-16">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm">
              <Link href="/" className="hover:underline opacity-75">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/equipment" className="hover:underline opacity-75">Equipment</Link>
              <span className="mx-2">/</span>
              <span>{displayName}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {displayName}
            </h1>
            <p className="text-xl opacity-90">
              {description}
            </p>
            {connected && (
              <div className="mt-4 text-sm text-green-200">
                ✓ Live inventory updates enabled
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder={`Search ${displayName.toLowerCase()}...`}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Price Filter */}
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as any)}
              >
                <option value="all">All Prices</option>
                <option value="budget">Under $100/day</option>
                <option value="mid">$100-$199/day</option>
                <option value="premium">$200+/day</option>
              </select>

              {/* View All Button */}
              <Link
                href="/equipment"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View All Equipment
              </Link>

              {/* Refresh Button */}
              <button
                onClick={() => refresh()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredEquipment.length} {displayName.toLowerCase()}
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="container mx-auto px-6 py-12">
          {isError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load equipment. Please try again.</p>
              <button
                onClick={() => refresh()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No ${displayName.toLowerCase()} found matching "${searchTerm}"`
                  : `No ${displayName.toLowerCase()} currently available`}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:underline mr-4"
                >
                  Clear search
                </button>
              )}
              <Link
                href="/equipment"
                className="text-blue-600 hover:underline"
              >
                View all equipment
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
                <Link
                  key={item.id}
                  href={`/equipment/${item.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform group-hover:scale-105">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {!item.available && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded">
                            Currently Unavailable
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 mb-2">
                        {item.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description || `Professional ${displayName.toLowerCase()} for your project`}
                      </p>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            ${item.daily_rate}
                          </p>
                          <p className="text-xs text-gray-500">per day</p>
                        </div>
                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}