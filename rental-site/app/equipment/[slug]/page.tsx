'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { MOCK_EQUIPMENT } from '@/lib/mockData'
import { checkAvailability, createBooking } from '@/lib/api/booking'
import { getEquipmentById, vehicleToEquipment } from '@/lib/api/equipment'
import { useEquipment } from '@/lib/hooks/useEquipment'
import { useRealtimeUpdates } from '@/lib/hooks/useRealtimeUpdates'
import type { Vehicle, VehicleFilters } from '@/lib/types/api'

// Map URL slugs to API category values
const CATEGORY_SLUGS: Record<string, string> = {
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

export default function EquipmentDynamicPage() {
  const params = useParams()
  const slug = params.slug as string

  // Check if slug is a category
  const isCategory = CATEGORY_SLUGS.hasOwnProperty(slug)

  // If it's a category, render the category page
  if (isCategory) {
    return <CategoryPage slug={slug} />
  }

  // Otherwise, treat it as an equipment ID
  return <EquipmentDetailPage id={slug} />
}

// Category page component
function CategoryPage({ slug }: { slug: string }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all')

  const apiCategory = CATEGORY_SLUGS[slug]
  const displayName = CATEGORY_DISPLAY_NAMES[slug]
  const description = CATEGORY_DESCRIPTIONS[slug]

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

// Equipment detail page component
function EquipmentDetailPage({ id }: { id: string }) {
  // Refs to prevent duplicate submissions
  const isSubmittingRef = useRef(false)
  const lastSubmissionRef = useRef<string>('')

  // State
  const [equipment, setEquipment] = useState<any>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [bookingModal, setBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [bookingError, setBookingError] = useState('')

  // Load equipment data
  useEffect(() => {
    async function loadEquipment() {
      setLoading(true)
      try {
        // Try to fetch from API first
        const vehicleData = await getEquipmentById(Number(id))
        setVehicle(vehicleData)
        const equipmentData = vehicleToEquipment(vehicleData)
        setEquipment(equipmentData)
      } catch (error) {
        console.error('Failed to fetch from API:', error)
        // Fall back to mock data
        const mockItem = MOCK_EQUIPMENT.find(e => e.id === Number(id))
        if (mockItem) {
          setEquipment(mockItem)
        } else {
          notFound()
        }
      } finally {
        setLoading(false)
      }
    }

    loadEquipment()
  }, [id])

  // Check availability when dates change
  useEffect(() => {
    if (startDate && endDate && vehicle) {
      setCheckingAvailability(true)
      checkAvailability({
        vehicle_id: vehicle.id,
        date_from: startDate,
        date_to: endDate
      })
        .then(response => {
          setIsAvailable(response.available)
          setEstimatedPrice(response.estimated_price)
        })
        .catch(error => {
          console.error('Failed to check availability:', error)
          setIsAvailable(null)
        })
        .finally(() => {
          setCheckingAvailability(false)
        })
    }
  }, [startDate, endDate, vehicle])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create submission key to prevent duplicates
    const submissionKey = `${vehicle?.id}-${startDate}-${endDate}-${bookingForm.email}`

    // Prevent duplicate submissions
    if (isSubmittingRef.current || lastSubmissionRef.current === submissionKey) {
      console.log('Preventing duplicate submission')
      return
    }

    if (!vehicle) return

    isSubmittingRef.current = true
    lastSubmissionRef.current = submissionKey
    setBookingStatus('submitting')
    setBookingError('')

    try {
      await createBooking({
        vehicle_id: vehicle.id,
        date_from: startDate,
        date_to: endDate,
        customer_name: bookingForm.name,
        customer_email: bookingForm.email,
        customer_phone: bookingForm.phone,
        message: bookingForm.message
      })

      setBookingStatus('success')
      // Clear form
      setBookingForm({ name: '', email: '', phone: '', message: '' })
      // Close modal after 3 seconds
      setTimeout(() => {
        setBookingModal(false)
        setBookingStatus('idle')
      }, 3000)
    } catch (error: any) {
      console.error('Booking failed:', error)
      setBookingStatus('error')
      setBookingError(error.message || 'Failed to submit booking')
    } finally {
      isSubmittingRef.current = false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!equipment) {
    return notFound()
  }

  // Mock multiple images (in production, these would come from the API)
  const images = [
    equipment.image_url,
    equipment.image_url,
    equipment.image_url
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/equipment" className="text-gray-600 hover:text-gray-800">Equipment</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{equipment.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-4">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage] || '/placeholder.jpg'}
                  alt={equipment.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {!equipment.available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-6 py-3 rounded-lg text-xl font-semibold">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-24 bg-gray-200 rounded overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img || '/placeholder.jpg'}
                      alt={`${equipment.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Details */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-4">
                {equipment.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{equipment.name}</h1>
              <p className="text-gray-600 text-lg">
                {equipment.description || 'Professional-grade equipment for your project needs.'}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Rental Rates</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Hourly</p>
                  <p className="text-2xl font-bold text-blue-600">${equipment.hourly_rate}</p>
                </div>
                <div className="text-center border-x">
                  <p className="text-gray-500 text-sm">Daily</p>
                  <p className="text-2xl font-bold text-blue-600">${equipment.daily_rate}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Weekly</p>
                  <p className="text-2xl font-bold text-blue-600">${equipment.weekly_rate}</p>
                </div>
              </div>
            </div>

            {/* Availability Checker */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Check Availability</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {checkingAvailability && (
                <p className="text-gray-600">Checking availability...</p>
              )}

              {isAvailable !== null && !checkingAvailability && startDate && endDate && (
                <div className={`p-4 rounded-lg mb-4 ${isAvailable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {isAvailable ? (
                    <div>
                      <p className="font-semibold">✓ Available for your dates!</p>
                      {estimatedPrice && (
                        <p className="text-sm mt-1">Estimated total: ${estimatedPrice.toFixed(2)}</p>
                      )}
                    </div>
                  ) : (
                    <p className="font-semibold">✗ Not available for these dates</p>
                  )}
                </div>
              )}

              <button
                onClick={() => setBookingModal(true)}
                disabled={!equipment.available || !isAvailable}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  equipment.available && isAvailable
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {equipment.available
                  ? (isAvailable ? 'Request Booking' : 'Select Available Dates')
                  : 'Currently Unavailable'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Rental Information</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Valid driver's license required</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Delivery available within service area</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Insurance requirements may apply</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>24/7 emergency support available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Request Booking</h3>

            {bookingStatus === 'success' ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-xl font-semibold text-gray-800">Booking Request Submitted!</p>
                <p className="text-gray-600 mt-2">We'll contact you shortly to confirm your rental.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    <strong>Equipment:</strong> {equipment.name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Dates:</strong> {startDate} to {endDate}
                  </p>
                  {estimatedPrice && (
                    <p className="text-gray-600">
                      <strong>Estimated Total:</strong> ${estimatedPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                {bookingStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-50 text-red-800 rounded">
                    {bookingError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Message (Optional)</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setBookingModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={bookingStatus === 'submitting'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingStatus === 'submitting'}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {bookingStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}