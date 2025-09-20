'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { MOCK_EQUIPMENT } from '@/lib/mockData'
import { checkAvailability, createBooking } from '@/lib/api/booking'
import { getEquipmentById, vehicleToEquipment } from '@/lib/api/equipment'
import type { Vehicle } from '@/lib/types/api'

export default function EquipmentDetailPage() {
  const params = useParams()
  const id = params.id as string

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
        console.log('API not available, using mock data')
        // Fallback to mock data
        const mockItem = MOCK_EQUIPMENT.find(item => item.id === Number(id))
        if (mockItem) {
          setEquipment(mockItem)
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
      handleCheckAvailability()
    }
  }, [startDate, endDate, vehicle])

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate || !vehicle) return

    setCheckingAvailability(true)
    setIsAvailable(null)
    setEstimatedPrice(null)

    try {
      const response = await checkAvailability({
        vehicle_id: vehicle.id,
        date_from: startDate,
        date_to: endDate
      })

      setIsAvailable(response.available)
      setEstimatedPrice(response.estimated_price)
    } catch (error) {
      console.error('Error checking availability:', error)
      // Fallback for mock data
      setIsAvailable(true)
      if (equipment) {
        const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        setEstimatedPrice(days * equipment.daily_rate)
      }
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent duplicate submissions
    if (isSubmittingRef.current) {
      console.log('Booking already in progress, ignoring duplicate submission')
      return
    }

    if (!vehicle || !startDate || !endDate) {
      setBookingError('Please select dates first')
      return
    }

    // Create a unique key for this submission
    const submissionKey = `${vehicle.id}-${startDate}-${endDate}-${bookingForm.email}`

    // Check if this exact booking was just submitted (within last 5 seconds)
    if (lastSubmissionRef.current === submissionKey) {
      console.log('Duplicate booking detected, ignoring')
      return
    }

    // Mark as submitting
    isSubmittingRef.current = true
    lastSubmissionRef.current = submissionKey
    setBookingStatus('submitting')
    setBookingError('')

    try {
      const response = await createBooking({
        vehicle_id: vehicle.id,
        customer_name: bookingForm.name,
        customer_email: bookingForm.email,
        customer_phone: bookingForm.phone,
        date_from: startDate,
        date_to: endDate,
        booking_type: 'reservation',
        message: bookingForm.message
      })

      setBookingStatus('success')
      setTimeout(() => {
        setBookingModal(false)
        setBookingStatus('idle')
        // Reset form
        setBookingForm({ name: '', email: '', phone: '', message: '' })
        // Clear submission tracking after success
        lastSubmissionRef.current = ''
      }, 3000)
    } catch (error: any) {
      setBookingStatus('error')
      setBookingError(error.message || 'Failed to create booking')
      // Clear submission key on error to allow retry
      setTimeout(() => {
        lastSubmissionRef.current = ''
      }, 2000)
    } finally {
      // Always clear the submitting flag
      isSubmittingRef.current = false
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="section-padding">
          <div className="container-custom">
            <div className="text-center">
              <p className="text-xl text-neutral-medium">Loading equipment details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!equipment) {
    return (
      <>
        <Header />
        <main className="section-padding">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Equipment Not Found</h1>
              <p className="text-xl text-neutral-medium mb-8">
                The equipment you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/equipment" className="btn btn-primary">
                Browse All Equipment
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const images = vehicle?.images || [{ url: equipment.image_url, name: equipment.name }]

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4">
          <div className="container-custom">
            <nav className="text-sm">
              <Link href="/" className="text-neutral-medium hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/equipment" className="text-neutral-medium hover:text-primary">Equipment</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-dark">{equipment.name}</span>
            </nav>
          </div>
        </section>

        {/* Equipment Details */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div>
                <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden mb-4">
                  {images[selectedImage]?.url ? (
                    <Image
                      src={images[selectedImage].url}
                      alt={equipment.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-6xl">🔧</span>
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        {img.url ? (
                          <Image
                            src={img.url}
                            alt={`${equipment.name} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Equipment Info */}
              <div>
                <div className="mb-6">
                  <p className="text-primary font-semibold mb-2">{equipment.category}</p>
                  <h1 className="text-3xl font-bold mb-4">{equipment.name}</h1>
                  {(equipment.description || vehicle?.short_description) && (
                    <p className="text-lg text-neutral-medium mb-6">
                      {equipment.description || vehicle?.short_description}
                    </p>
                  )}

                  {vehicle?.full_description && (
                    <div className="prose prose-lg max-w-none mb-6">
                      <p>{vehicle.full_description}</p>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="card p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Rental Rates</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-medium">Hourly:</span>
                      <span className="font-bold text-lg">${equipment.hourly_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-medium">Daily:</span>
                      <span className="font-bold text-lg">${equipment.daily_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-medium">Weekly:</span>
                      <span className="font-bold text-lg">${equipment.weekly_rate}</span>
                    </div>
                    {vehicle?.rental_price_monthly && (
                      <div className="flex justify-between">
                        <span className="text-neutral-medium">Monthly:</span>
                        <span className="font-bold text-lg">${vehicle.rental_price_monthly}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability Checker */}
                <div className="card p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Check Availability</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {checkingAvailability && (
                    <p className="text-neutral-medium">Checking availability...</p>
                  )}

                  {isAvailable !== null && !checkingAvailability && (
                    <div className={`p-4 rounded-lg mb-4 ${
                      isAvailable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {isAvailable ? (
                        <>
                          <p className="font-semibold">✓ Available for these dates!</p>
                          {estimatedPrice && (
                            <p className="mt-2">Estimated Total: <span className="font-bold">${estimatedPrice}</span></p>
                          )}
                        </>
                      ) : (
                        <p className="font-semibold">✗ Not available for these dates</p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setBookingModal(true)}
                    disabled={!isAvailable || !startDate || !endDate}
                    className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!startDate || !endDate ? 'Select Dates to Book' :
                     !isAvailable ? 'Not Available' : 'Book Now'}
                  </button>
                </div>

                {/* Specifications */}
                {vehicle?.specifications && (
                  <div className="card p-6">
                    <h3 className="text-xl font-bold mb-4">Specifications</h3>
                    <dl className="grid grid-cols-2 gap-4">
                      {Object.entries(vehicle.specifications).map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-sm text-neutral-medium">{key}</dt>
                          <dd className="font-semibold">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Equipment */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8">Related Equipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_EQUIPMENT
                .filter(item => item.category === equipment.category && item.id !== equipment.id)
                .slice(0, 3)
                .map(item => (
                  <Link key={item.id} href={`/equipment/${item.id}`} className="card group">
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
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-sm text-neutral-medium">From ${item.daily_rate}/day</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Complete Your Booking</h2>

            {bookingStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <p className="text-xl font-semibold mb-2">Booking Confirmed!</p>
                <p className="text-neutral-medium">We'll contact you shortly with details.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="mb-4">
                  <p className="text-sm text-neutral-medium mb-2">
                    Booking: <strong>{equipment.name}</strong>
                  </p>
                  <p className="text-sm text-neutral-medium">
                    Dates: {startDate} to {endDate}
                  </p>
                  {estimatedPrice && (
                    <p className="text-sm text-neutral-medium">
                      Total: <strong>${estimatedPrice}</strong>
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Additional Notes</label>
                    <textarea
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {bookingError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                    {bookingError}
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setBookingModal(false)}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingStatus === 'submitting'}
                    className="flex-1 btn btn-primary"
                  >
                    {bookingStatus === 'submitting' ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}